import '@polymeshassociation/polymesh-types/polkadot/augment-api';
import '@polymeshassociation/polymesh-types/polkadot/augment-types';

import type { AugmentedQuery } from '@polkadot/api-base/types';
import type { Option } from '@polkadot/types/codec';
import type { FrameSystemAccountInfo, PolymeshPrimitivesIdentityClaim, PolymeshPrimitivesIdentityId, PolymeshPrimitivesSecondaryKeyKeyRecord } from '@polkadot/types/lookup';
import type { Observable } from '@polkadot/types/types';
import type { Vec } from '@polkadot/types-codec';
import type {} from '@polymeshassociation/polymesh-types/polkadot/types-lookup'; // required for declaration merging with @polkadot/types/lookup
import type { AccountData, KeyringAccountData, NetworkName, UnsubCallback } from './types';

import { encodeAddress } from '@polkadot/util-crypto';
import { union } from 'lodash-es';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise, { disconnect } from './external/apiPromise';
import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as networkActions } from './store/features/network';
import { actions as statusActions } from './store/features/status';
import { getAccountsList, getNetwork, getNetworkUrl } from './store/getters';
import { subscribeCustomNetworkUrl, subscribeSelectedNetwork } from './store/subscribers';
import { POLYMESH_GENERIC_SPEC_VERSION, populatedDelay } from './constants';
import store from './store';
import { KeyType } from './types';
import { accountBalances, apiErrorHandler, observeAccounts } from './utils';

interface UnsubCallbacks {
  accounts?: UnsubCallback;
  customNetworkUrl?: UnsubCallback;
  network?: UnsubCallback;
}

const unsubCallbacks: UnsubCallbacks = {};
const accountUnsubCallbacks: Record<string, UnsubCallback> = {};

interface IdentityState {
  did: string;
  msKeys: string[];
  priKey: string;
  secKeys: string[];
  cdd?: {
    expiry: number | undefined;
    issuer: string;
  };
}

type ActiveMembersQuery = AugmentedQuery<
'promise',
() => Observable<Vec<PolymeshPrimitivesIdentityId>>,
[]
>;

/**
 * Synchronize accounts between keyring and redux store.
 */
export function accountsSynchronizer (): () => void {
  const sub = observeAccounts((accountsData: KeyringAccountData[]) => {
    function accountName (_address: string): string | undefined {
      return accountsData.find(({ address }) => address === _address)?.name;
    }

    const prevAccounts: string[] = getAccountsList();

    const accounts = accountsData.map(({ address }) => address);
    const newAccounts = difference(accounts, prevAccounts);
    const removedAccounts = difference(prevAccounts, accounts);
    const preExistingAccounts = intersection(prevAccounts, accounts);

    // A) If account is removed, clean up any associated subscriptions
    removedAccounts.forEach((account) => {
      store.dispatch(accountActions.removeAccount(account));
    });

    // B) Insert or update remaining accounts
    union(newAccounts, preExistingAccounts).forEach((account) => {
      const accountData: AccountData = {
        address: account,
        name: accountName(account)
      };

      store.dispatch(accountActions.setAccount(accountData));
    });
  });

  return () => sub.unsubscribe();
}

const claimSorter = (a: PolymeshPrimitivesIdentityClaim, b: PolymeshPrimitivesIdentityClaim) => {
  if (a.expiry.isEmpty) {
    return -1;
  } else if (b.expiry.isEmpty) {
    return 1;
  } else {
    // The last CDD to expire should come first.
    return a.expiry.unwrapOrDefault() > b.expiry.unwrapOrDefault() ? -1 : 1;
  }
};

const claims2Record = (didClaims: PolymeshPrimitivesIdentityClaim[]) => {
  // Sort claims array by expiry (non-expiring first)
  didClaims.sort(claimSorter);

  // Save CDD data
  return didClaims && didClaims.length > 0
    ? {
      expiry: !didClaims[0].expiry.isEmpty ? Number(didClaims[0].expiry.toString()) : undefined,
      issuer: didClaims[0].claimIssuer.toString()
    }
    : undefined;
};

const initApiPromise = (network: NetworkName, networkUrl: string) =>
  apiPromise(networkUrl)
    .then((api) => {
      console.log(`Poly: Connected to ${network}, via ${networkUrl}`);
      // Clear errors
      store.dispatch(statusActions.apiReady());
      // Set the ss58Format and genesisHash from the connected chain.
      store.dispatch(networkActions.setFormat(api.registry.chainSS58));
      store.dispatch(networkActions.setGenesisHash(api.genesisHash.toHex()));

      // TODO: Remove this temporary v7/v8 branch once all supported chains are on Polymesh v8.
      const isV8 =
        api.runtimeVersion.specVersion.toNumber() >=
        POLYMESH_GENERIC_SPEC_VERSION;

      store.dispatch({ payload: isV8, type: 'network/setIsV8' });

      // Fetch existential deposit for balance calculations
      const existentialDeposit = api.consts.balances.existentialDeposit.toBn();

      setTimeout(() => {
        store.dispatch(statusActions.populated(network));
      }, populatedDelay);

      let prevAccounts: string[] = [];

      const subscribeAccounts = (activeIssuers: Set<string>) => {
        /**
         * Accounts
         */
        console.log('Poly: Subscribing to accounts');

        const accountsSub = observeAccounts(
          (accountsData: KeyringAccountData[]) => {
            if (network !== getNetwork()) {
              return;
            }

            function accountName (_address: string): string | undefined {
              return accountsData.find(({ address }) => address === _address)
                ?.name;
            }

            const accounts = accountsData.map(({ address }) => address);

            // A) Clean subscriptions of previous accounts list
            prevAccounts.forEach((account) => {
              if (accountUnsubCallbacks[account]) {
                accountUnsubCallbacks[account]();
                delete accountUnsubCallbacks[account];
              }
            });

            // B) Remove any previously stored DIDs
            store.dispatch(identityActions.clearCurrentIdentities());

            // Used for setting redux state.
            const identityStateData: Record<string, IdentityState> = {};

            // C) Create new subscriptions to:
            accounts.forEach((account) => {
              api
                .queryMulti(
                  [
                    // 1) Account balance
                    // @ts-expect-error Type mismatch due to strict generated types not including QueryableStorageEntry overloads
                    [api.query.system.account, account],
                    // 2) Identities linked to account.
                    // @ts-expect-error Type mismatch due to strict generated types not including QueryableStorageEntry overloads
                    [api.query.identity.keyRecords, account]
                  ],
                  async ([accData, linkedKeyInfo]: [
                    FrameSystemAccountInfo,
                    Option<PolymeshPrimitivesSecondaryKeyKeyRecord>
                  ]) => {
                    // Store account metadata
                    const { locked, total, transferrable } = accountBalances(
                      accData.data,
                      existentialDeposit
                    );

                    store.dispatch(
                      accountActions.setAccount({
                        address: account,
                        balance: {
                          locked,
                          total,
                          transferrable
                        },
                        name: accountName(account)
                      })
                    );

                    if (linkedKeyInfo?.isEmpty) {
                      store.dispatch(
                        accountActions.setAccount({
                          address: account,
                          keyType: undefined
                        })
                      );
                      store.dispatch(
                        identityActions.removeCurrentIdentity(account)
                      );

                      return;
                    }

                    const linkedKeyInfoObj = linkedKeyInfo.unwrap();

                    const isPrimary = linkedKeyInfoObj.isPrimaryKey;
                    const isSecondary = linkedKeyInfoObj.isSecondaryKey;
                    const isMultiSig = linkedKeyInfoObj.isMultiSigSignerKey;

                    const keyType = isPrimary
                      ? KeyType.primary
                      : isSecondary
                        ? KeyType.secondary
                        : isMultiSig
                          ? KeyType.multisig
                          : undefined;

                    store.dispatch(
                      accountActions.setAccount({
                        address: account,
                        keyType
                      })
                    );

                    let did: string;

                    // MultiSigs require one additional query to get their DIDs
                    if (isMultiSig) {
                      const msLinkedKeyInfo =
                        (await api.query.identity.keyRecords(
                          linkedKeyInfoObj.asMultiSigSignerKey
                        ));

                      if (msLinkedKeyInfo?.isEmpty) {
                        // Signer key can point to a multisig that is no longer linked to a DID.
                        store.dispatch(
                          identityActions.removeCurrentIdentity(account)
                        );

                        return;
                      }

                      const msLinkedKeyInfoObj = msLinkedKeyInfo.unwrap();
                      const isMsPrimaryKey = msLinkedKeyInfoObj.isPrimaryKey;

                      if (!isMsPrimaryKey && !msLinkedKeyInfoObj.isSecondaryKey) {
                        store.dispatch(
                          identityActions.removeCurrentIdentity(account)
                        );

                        return;
                      }

                      did = isMsPrimaryKey
                        ? msLinkedKeyInfoObj.asPrimaryKey.toString()
                        : msLinkedKeyInfoObj.asSecondaryKey.toString();
                    } else {
                      did = isPrimary
                        ? linkedKeyInfoObj.asPrimaryKey.toString()
                        : linkedKeyInfoObj.asSecondaryKey.toString();
                    }

                    // Initialize identity state for network:did pair
                    if (!identityStateData[did]) {
                      identityStateData[did] = {
                        did,
                        msKeys: [],
                        priKey: '',
                        secKeys: []
                      };
                    }

                    const isSecKeyAdded = identityStateData[did].secKeys.includes(encodeAddress(account));
                    const isMsKeyAdded = identityStateData[did].msKeys.includes(encodeAddress(account));

                    if (isPrimary) {
                      identityStateData[did].priKey = encodeAddress(account);
                    } else if (isSecondary && !isSecKeyAdded) {
                      identityStateData[did].secKeys = [...identityStateData[did].secKeys, encodeAddress(account)];
                    } else if (isMultiSig && !isMsKeyAdded) {
                      identityStateData[did].msKeys = [...identityStateData[did].msKeys, encodeAddress(account)];
                    }

                    if (!isV8) {
                      // TODO: Remove this legacy CDD claim lookup once all supported chains are on Polymesh v8.
                      const claimData = await api.query.identity.claims.entries(
                        {
                          claimType: 'CustomerDueDiligence',
                          target: did
                        }
                      );
                      const cddData = claimData
                        .map(([, claim]) => claim)
                        .filter((claim) => !claim.isEmpty)
                        .map((claim) => claim.unwrapOrDefault())
                        .filter((claim) => {
                          return activeIssuers.has(claim.claimIssuer.toString());
                        });

                      const cdd = claims2Record(cddData);

                      if (cdd) {
                        identityStateData[did].cdd = cdd;
                      }
                    }

                    store.dispatch(
                      identityActions.setIdentity({
                        account,
                        data: identityStateData[did]
                      })
                    );
                  }
                )
                .then((unsub) => {
                  accountUnsubCallbacks[account] = unsub;
                }, apiErrorHandler)
                .catch(apiErrorHandler);
            });

            prevAccounts = accounts;
          }
        );

        unsubCallbacks.accounts && unsubCallbacks.accounts();
        unsubCallbacks.accounts = () => accountsSub.unsubscribe();
      };

      if (isV8) {
        subscribeAccounts(new Set<string>());

        return;
      }

      // TODO: Remove this legacy CDD issuer lookup once all supported chains are on Polymesh v8.
      const queryActiveMembers = api.query['cddServiceProviders']?.['activeMembers'] as
        | ActiveMembersQuery
        | undefined;

      if (!queryActiveMembers) {
        subscribeAccounts(new Set<string>());

        return;
      }

      queryActiveMembers()
        .then((members) => {
          const activeIssuers = new Set(
            members.toArray().map((member) => member.toString())
          );

          // Add the CDDProvider & Committee systematic CDD providers
          activeIssuers.add(
            '0x73797374656d3a637573746f6d65725f6475655f64696c6967656e6365000000'
          );
          activeIssuers.add(
            '0x73797374656d3a676f7665726e616e63655f636f6d6d69747465650000000000'
          );

          subscribeAccounts(activeIssuers);
        }, apiErrorHandler)
        .catch(apiErrorHandler);
    }, apiErrorHandler)
    .catch(apiErrorHandler);

function subscribePolymesh (): () => void {
  function unsubAll (): void {
    (async () => {
      for (const key in accountUnsubCallbacks) {
        if (accountUnsubCallbacks[key]) {
          try {
            accountUnsubCallbacks[key]();
            delete accountUnsubCallbacks[key];
          } catch (error) {
            console.error(error);
          }
        }
      }

      for (const key of Object.keys(unsubCallbacks) as (keyof UnsubCallbacks)[]) {
        const unsub = unsubCallbacks[key];

        if (!unsub) {
          continue;
        }

        unsub();
        delete unsubCallbacks[key];
      }

      await disconnect();
    })().catch((error) => {
      console.log(error);
    });
  }

  console.log('Poly: fetching data from chain');

  !!unsubCallbacks.network && unsubCallbacks.network();

  unsubCallbacks.network = subscribeSelectedNetwork((network) => {
    (async () => {
      try {
        await disconnect();

        if (network) {
          console.log('Poly: Selected network', network);
          store.dispatch(statusActions.init());
          const networkUrl = getNetworkUrl();

          await initApiPromise(network, networkUrl);
        }
      } catch (error) {
        console.error('Error during network subscription:', error);
      }
    })().catch((error) => {
      console.log(error);
    });
  });

  !!unsubCallbacks.customNetworkUrl && unsubCallbacks.customNetworkUrl();

  let firstCall = true;

  unsubCallbacks.customNetworkUrl = subscribeCustomNetworkUrl((customNetworkUrl: string) => {
    (async () => {
      await disconnect();

      if (customNetworkUrl && !firstCall) {
        console.log('Poly: Custom rpc url', customNetworkUrl);
        store.dispatch(statusActions.init());
        const network = getNetwork();

        await initApiPromise(network, customNetworkUrl);
      }

      firstCall = false;
    }
    )().catch((error) => {
      console.error('Error during custom network URL subscription:', error);
    });
  });

  return unsubAll;
}

export default subscribePolymesh;
