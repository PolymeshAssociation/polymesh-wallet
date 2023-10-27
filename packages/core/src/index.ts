import '@polkadot/api-augment';
import { Option } from '@polkadot/types/codec';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';
import { union } from 'lodash-es';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise from './external/apiPromise';
import { IdentityClaim, LinkedKeyInfo } from './external/apiPromise/types';
import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as networkActions } from './store/features/network';
import { actions as statusActions } from './store/features/status';
import { getAccountsList, getNetwork, getNetworkUrl } from './store/getters';
import {
  subscribeSelectedNetwork,
  subscribeCustomNetworkUrl,
} from './store/subscribers';
import { populatedDelay } from './constants';
import store from './store';
import { AccountData, KeyringAccountData, NetworkName, UnsubCallback } from './types';
import { accountBalances, apiErrorHandler, observeAccounts } from './utils';

const unsubCallbacks: Record<string, UnsubCallback> = {};

/**
 * Synchronize accounts between keyring and redux store.
 */
export function accountsSynchronizer(): () => void {
  const sub = observeAccounts((accountsData: KeyringAccountData[]) => {
    function accountName(_address: string): string | undefined {
      return accountsData.find(({ address }) => address === _address)?.name;
    }

    const prevAccounts: string[] = getAccountsList();

    const accounts = accountsData.map(({ address }) => address);
    const newAccounts = difference(accounts, prevAccounts);
    const removedAccounts = difference(prevAccounts, accounts);
    const preExistingAccounts = intersection(prevAccounts, accounts);

    // A) If account is removed, clean up any associated subscriptions
    removedAccounts.forEach((account) => {
      store.dispatch(accountActions.removeAccountGlobally(account));
    });

    // B) Insert or update remaining accounts
    union(newAccounts, preExistingAccounts).forEach((account) => {
      const accountData: AccountData = {
        address: account,
        name: accountName(account),
      };

      store.dispatch(accountActions.setAccountGlobally(accountData));
    });
  });

  return () => sub.unsubscribe();
}

const claimSorter = (a: IdentityClaim, b: IdentityClaim) => {
  if (a.expiry.isEmpty) {
    return -1;
  } else if (b.expiry.isEmpty) {
    return 1;
  } else {
    // The last CDD to expire should come first.
    return a.expiry.unwrapOrDefault() > b.expiry.unwrapOrDefault() ? -1 : 1;
  }
};

const claims2Record = (didClaims: IdentityClaim[]) => {
  // Sort claims array by expiry (non-expiring first)
  didClaims.sort(claimSorter);
  // Save CDD data
  return didClaims && didClaims.length > 0
    ? {
      issuer: didClaims[0].claimIssuer.toString(),
      expiry: !didClaims[0].expiry.isEmpty
        ? Number(didClaims[0].expiry.toString())
        : undefined,
    }
    : undefined;
};

const initApiPromise = (network: NetworkName, networkUrl: string) => apiPromise(networkUrl)
  .then((api) => {
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
        activeIssuers = (members as unknown as string[]).map((member) =>
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
            function accountName(_address: string): string | undefined {
              return accountsData.find(
                ({ address }) => address === _address
              )?.name;
            }

            const accounts = accountsData.map(({ address }) => address);

            // A) Clean subscriptions of previous accounts list
            prevAccounts.forEach((account) => {
              if (unsubCallbacks[account]) {
                unsubCallbacks[account]();
                delete unsubCallbacks[account];
              }
            });

            // Used for setting redux state. This is as a re-work of previous (v4) mechanism
            const identityStateData: any = {};

            // B) Create new subscriptions to:
            accounts.forEach((account) => {
              api
                .queryMulti(
                  [
                    // 1) Account balance
                    [api.query.system.account, account],
                    // 2) Identities linked to account.
                    [api.query.identity.keyRecords, account],
                  ],
                  async ([accData, linkedKeyInfo]: [
                    AccountInfo,
                    Option<LinkedKeyInfo>
                  ]) => {
                    // Store account metadata
                    const { locked, total, transferrable } =
                      accountBalances(accData.data);

                    store.dispatch(
                      accountActions.setAccount({
                        data: {
                          address: account,
                          name: accountName(account),
                          balance: { total, transferrable, locked },
                        },
                        network,
                      })
                    );

                    if (linkedKeyInfo && linkedKeyInfo.isEmpty) {
                      store.dispatch(identityActions.removeCurrentIdentity(account));
                      return;
                    }

                    const linkedKeyInfoObj: any = linkedKeyInfo.toJSON();

                    const isPrimary = !!linkedKeyInfoObj.primaryKey;
                    const isSecondary = !!linkedKeyInfoObj.secondaryKey;
                    const isMultiSig =
                      !!linkedKeyInfoObj.multiSigSignerKey;

                    let did;
                    // MultiSigs require one additional query to get their DIDs
                    if (isMultiSig) {
                      const msLinkedKeyInfo =
                        await api.query.identity.keyRecords(
                          linkedKeyInfoObj.multiSigSignerKey
                        );
                      if (msLinkedKeyInfo && msLinkedKeyInfo.isEmpty)
                        throw new Error('msLinkedKeyInfo is missing');
                      const msLinkedKeyInfoObj: any =
                        msLinkedKeyInfo.toJSON();
                      const isMsPrimaryKey =
                        !!msLinkedKeyInfoObj.primaryKey;
                      did = isMsPrimaryKey
                        ? msLinkedKeyInfoObj.primaryKey
                        : msLinkedKeyInfoObj.secondaryKey[0];
                    } else {
                      did = isPrimary
                        ? linkedKeyInfoObj.primaryKey
                        : linkedKeyInfoObj.secondaryKey[0];
                    }

                    // Initialize identity state for network:did pair
                    if (!identityStateData[did])
                      identityStateData[did] = {
                        did,
                        secKeys: [],
                        msKeys: [],
                      };
                    const isSecKeyAdded = identityStateData[
                      did
                    ].secKeys.includes(encodeAddress(account));
                    const isMsKeyAdded = identityStateData[
                      did
                    ].msKeys.includes(encodeAddress(account));
                    if (isPrimary)
                      identityStateData[did].priKey =
                        encodeAddress(account);
                    else if (isSecondary && !isSecKeyAdded)
                      identityStateData[did].secKeys = [
                        ...identityStateData[did].secKeys,
                        encodeAddress(account),
                      ];
                    else if (isMultiSig && !isMsKeyAdded)
                      identityStateData[did].msKeys = [
                        ...identityStateData[did].msKeys,
                        encodeAddress(account),
                      ];

                    const claimData = await api.query.identity.claims.entries({
                      target: did,
                      claimType: 'CustomerDueDiligence',
                    })
                    const cddData = (claimData as [unknown, Option<IdentityClaim>][])
                      .map(([, claim]) => claim)
                      .filter((claim) => !claim.isEmpty)
                      .map(
                        (claim) => claim.unwrapOrDefault?.() ?? claim
                      )
                      .filter((claim) => {
                        return (
                          activeIssuers.indexOf(
                            claim.claimIssuer.toString()
                          ) !== -1
                        );
                      })

                    const cdd = claims2Record(cddData);
                    if (cdd) {
                      identityStateData[did].cdd = cdd;
                    }

                    store.dispatch(
                      identityActions.setIdentity({
                        account,
                        data: identityStateData[did],
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

function subscribePolymesh(): () => void {
  function unsubAll(): void {
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
  }

  console.log('Poly: fetching data from chain');

  !!unsubCallbacks.network && unsubCallbacks.network();

  unsubCallbacks.network = subscribeSelectedNetwork((network) => {
    if (network) {
      console.log('Poly: Selected network', network);
      store.dispatch(statusActions.init());
      const networkUrl = getNetworkUrl()
      initApiPromise(network, networkUrl);
    }
  });

  !!unsubCallbacks.customNetworkUrl && unsubCallbacks.customNetworkUrl();

  unsubCallbacks.customNetworkUrl = subscribeCustomNetworkUrl((customNetworkUrl: string) => {
    if (customNetworkUrl) {
      console.log('Poly: Custom rpc url', customNetworkUrl);
      store.dispatch(statusActions.init());
      const network = getNetwork()
      initApiPromise(network, customNetworkUrl);
    }
  });

  return unsubAll;
}

export default subscribePolymesh;