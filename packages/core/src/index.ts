import '@polkadot/api-augment';

import type { StorageKey } from '@polkadot/types';
import type { Option, Vec } from '@polkadot/types/codec';
import type { FrameSystemAccountInfo, PalletIdentityClaim1stKey, PalletIdentityClaim2ndKey, PolymeshPrimitivesIdentityClaim, PolymeshPrimitivesIdentityId, PolymeshPrimitivesSecondaryKeyKeyRecord } from '@polymeshassociation/polymesh-sdk/polkadot/types-lookup';
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
import { populatedDelay } from './constants';
import store from './store';
import { accountBalances, apiErrorHandler, observeAccounts } from './utils';

const unsubCallbacks: Record<string, UnsubCallback> = {};

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
      // Set the ss58Format that'll be used for address rendering.
      store.dispatch(networkActions.setFormat(api.registry.chainSS58));

      setTimeout(() => {
        store.dispatch(statusActions.populated(network));
      }, populatedDelay);

      let prevAccounts: string[] = [];
      let activeIssuers: string[] = [];

      api.query.cddServiceProviders
        .activeMembers()
        .then((members) => {
          activeIssuers = (members as Vec<PolymeshPrimitivesIdentityId>).map((member) =>
            member.toString()
          );
          // Add the CDDProvider & Committee systematic CDD providers
          activeIssuers.push(
            '0x73797374656d3a637573746f6d65725f6475655f64696c6967656e6365000000'
          );
          activeIssuers.push(
            '0x73797374656d3a676f7665726e616e63655f636f6d6d69747465650000000000'
          );
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
                if (unsubCallbacks[account]) {
                  unsubCallbacks[account]();
                  delete unsubCallbacks[account];
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
                      [api.query.system.account, account],
                      // 2) Identities linked to account.
                      [api.query.identity.keyRecords, account]
                    ],
                    async ([accData, linkedKeyInfo]: [
                      FrameSystemAccountInfo,
                      Option<PolymeshPrimitivesSecondaryKeyKeyRecord>
                    ]) => {
                      // Store account metadata
                      const { locked, total, transferrable } = accountBalances(
                        accData.data
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
                          identityActions.removeCurrentIdentity(account)
                        );

                        return;
                      }

                      const linkedKeyInfoObj = linkedKeyInfo.unwrap();

                      const isPrimary = linkedKeyInfoObj.isPrimaryKey;
                      const isSecondary = linkedKeyInfoObj.isSecondaryKey;
                      const isMultiSig = linkedKeyInfoObj.isMultiSigSignerKey;

                      let did: string;

                      // MultiSigs require one additional query to get their DIDs
                      if (isMultiSig) {
                        const msLinkedKeyInfo =
                          (await api.query.identity.keyRecords(
                            linkedKeyInfoObj.asMultiSigSignerKey
                          )) as Option<PolymeshPrimitivesSecondaryKeyKeyRecord>;

                        if (msLinkedKeyInfo?.isEmpty) {
                          throw new Error('msLinkedKeyInfo is missing');
                        }

                        const msLinkedKeyInfoObj = msLinkedKeyInfo.unwrap();
                        const isMsPrimaryKey = msLinkedKeyInfoObj.isPrimaryKey;

                        did = isMsPrimaryKey
                          ? msLinkedKeyInfoObj.asPrimaryKey.toString()
                          : (
                            // This check is required for backwards compatibility with Polymesh v6
                            // TODO: remove after v7 update
                            msLinkedKeyInfoObj.asSecondaryKey.length === 32
                              ? msLinkedKeyInfoObj.asSecondaryKey.toString()
                              : msLinkedKeyInfoObj.asSecondaryKey[0].toString()
                          );
                      } else {
                        did = isPrimary
                          ? linkedKeyInfoObj.asPrimaryKey.toString()
                          : (
                            // This check is required for backwards compatibility with Polymesh v6
                            // TODO: remove after v7 update
                            linkedKeyInfoObj.asSecondaryKey.length === 32
                              ? linkedKeyInfoObj.asSecondaryKey.toString()
                              : linkedKeyInfoObj.asSecondaryKey[0].toString()
                          );
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

                      const claimData = await api.query.identity.claims.entries(
                        {
                          claimType: 'CustomerDueDiligence',
                          target: did
                        }
                      );
                      const cddData = (
                        claimData as [StorageKey<[PalletIdentityClaim1stKey, PalletIdentityClaim2ndKey]>, Option<PolymeshPrimitivesIdentityClaim>][]
                      )
                        .map(([, claim]) => claim)
                        .filter((claim) => !claim.isEmpty)
                        .map((claim) => claim.unwrapOrDefault?.() ?? claim)
                        .filter((claim): claim is PolymeshPrimitivesIdentityClaim => {
                          return (
                            activeIssuers.includes(
                              claim.claimIssuer.toString()
                            )
                          );
                        });

                      const cdd = claims2Record(cddData);

                      if (cdd) {
                        identityStateData[did].cdd = cdd;
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
                    unsubCallbacks[account] = unsub;
                  }, apiErrorHandler)
                  .catch(apiErrorHandler);
              });

              prevAccounts = accounts;
            }
          );

          unsubCallbacks.accounts && unsubCallbacks.accounts();
          unsubCallbacks.accounts = () => accountsSub.unsubscribe();
        }, apiErrorHandler)
        .catch(apiErrorHandler);
    }, apiErrorHandler)
    .catch(apiErrorHandler);

function subscribePolymesh (): () => void {
  function unsubAll (): void {
    (async () => {
      for (const key in unsubCallbacks) {
        if (unsubCallbacks[key]) {
          try {
            unsubCallbacks[key]();
            delete unsubCallbacks[key];
          } catch (error) {
            console.error(error);
          }
        }
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
