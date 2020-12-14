import { Option } from '@polkadot/types/codec';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise, { destroy } from './api/apiPromise';
import { DidRecord, LinkedKeyInfo, IdentityClaim } from './api/apiPromise/types';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';

import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as statusActions } from './store/features/status';
import store from './store';
import { AccountData, IdentityData, KeyringAccountData, NetworkName, UnsubCallback } from './types';
import { subscribeDidsList, subscribeIsHydratedAndNetwork } from './store/subscribers';
import { getAccountsList, getDids } from './store/getters';
import { nonFatalErrorHandler, observeAccounts } from './utils';
import { union } from 'lodash-es';

const unsubCallbacks: Record<string, UnsubCallback> = {};

let currentNetwork: NetworkName;

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
      store.dispatch(accountActions.removeAccountGlobally(account));
    });

    // B) Insert or update remaining accounts
    union(newAccounts, preExistingAccounts).forEach((account) => {
      const accountData: AccountData = {
        address: account,
        name: accountName(account)
      };

      store.dispatch(accountActions.setAccountGlobally(accountData));
    });
  });

  return () => sub.unsubscribe();
}

function subscribePolymesh (): () => void {
  function unsubAll (): void {
    Object.keys(unsubCallbacks).forEach((key) => {
      if (unsubCallbacks[key]) {
        try {
          unsubCallbacks[key]();
          delete unsubCallbacks[key];
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  subscribeIsHydratedAndNetwork((network) => {
    if (network && currentNetwork !== network) {
      currentNetwork = network;

      // Unsubscribe from all subscriptions before preparing a new list of subscriptions
      // to the newly selected network.
      unsubAll();

      store.dispatch(statusActions.init());

      apiPromise(network)
        .then((api) => {
          // Clear errors
          store.dispatch(statusActions.isReady());

          let prevAccounts: string[] = [];
          let prevDids: string[] = [];
          let activeIssuers: string[] = [];

          api.query.cddServiceProviders.activeMembers().then(
            (members) => {
              activeIssuers = (members as unknown as string[]).map((member) => member.toString());

              /**
             * Accounts
             */
              const accountsSub = observeAccounts((accountsData: KeyringAccountData[]) => {
                function accountName (_address: string): string | undefined {
                  return accountsData.find(({ address }) => address === _address)?.name;
                }

                const accounts = accountsData.map(({ address }) => address);
                const newAccounts = difference(accounts, prevAccounts);
                const removedAccounts = difference(prevAccounts, accounts);

                // 0) Check for orphan accounts that don't have a corresponding key
                const storeAccounts = getAccountsList();
                const orphanAccounts = difference(storeAccounts, accounts);

                // A) If account is removed, clean up any associated subscriptions
                union(removedAccounts, orphanAccounts).forEach((account) => {
                  if (unsubCallbacks[account]) {
                    unsubCallbacks[account]();
                    delete unsubCallbacks[account];
                  }
                });

                // B) Subscribe to new accounts
                newAccounts.forEach((account) => {
                  api.queryMulti([
                    [api.query.system.account, account],
                    [api.query.identity.keyToIdentityIds, account]
                  ], ([accData, linkedKeyInfo]: [AccountInfo, Option<LinkedKeyInfo>]) => {
                    const accountData: AccountData = {
                      address: account,
                      balance: accData.data.free.toString(),
                      name: accountName(account)
                    };

                    store.dispatch(accountActions.setAccount({ data: accountData, network }));

                    if (!linkedKeyInfo.isEmpty) {
                      store.dispatch(identityActions.setIdentity({ data: {
                        did: linkedKeyInfo.toString(),
                        priKey: account
                      },
                      network }));
                    }
                  }).then((unsub) => {
                    unsubCallbacks[account] && unsubCallbacks[account]();
                    unsubCallbacks[account] = unsub;
                  }, nonFatalErrorHandler).catch(nonFatalErrorHandler);
                });

                prevAccounts = accounts;
              });

              unsubCallbacks.accounts && unsubCallbacks.accounts();
              unsubCallbacks.accounts = () => accountsSub.unsubscribe();

              /**
             * Identities
             */
              unsubCallbacks.dids && unsubCallbacks.dids();
              unsubCallbacks.dids = subscribeDidsList((dids: string[]) => {
                const newDids = difference(dids, prevDids);
                const removedDids = difference(prevDids, dids);

                newDids.forEach((did) => {
                // Get the keys associated with this DID.
                  api.query.identity.didRecords<DidRecord>(did, (didRecords) => {
                    const priKey = encodeAddress(didRecords.primary_key);
                    const secKeys = didRecords.secondary_keys.toArray().reduce((keys, item) => {
                      return item.signer.isAccount
                        ? keys.concat(encodeAddress(item.signer.asAccount))
                        : keys;
                    }, [] as string[]);

                    const identityData: IdentityData = {
                      did,
                      priKey,
                      secKeys
                    };

                    store.dispatch(identityActions.setIdentity({ data: identityData, network }));
                  })
                    .then((unsub) => {
                      unsubCallbacks[did] && unsubCallbacks[did]();
                      unsubCallbacks[did] = unsub;
                    }, nonFatalErrorHandler)
                    .catch(nonFatalErrorHandler);
                });

                removedDids.forEach((did) => {
                  if (unsubCallbacks[did]) {
                    unsubCallbacks[did]();
                    delete unsubCallbacks[did];
                  }

                  if (unsubCallbacks[`${did}:cdd`]) {
                    unsubCallbacks[`${did}:cdd`]();
                    delete unsubCallbacks[`${did}:cdd`];
                  }
                });

                prevDids = dids;
              });

              /**
             * CDD
             */
              unsubCallbacks.newHeads && unsubCallbacks.newHeads();
              api.rpc.chain.subscribeNewHeads(() => {
                const dids = getDids();
                const promises = dids.map((did) =>
                  api.query.identity.claims.entries({ target: did, claim_type: 'CustomerDueDiligence' }));

                Promise.all(promises)
                  .then((results) =>
                    (results as [unknown, IdentityClaim][][]).map((result) => result.length
                      ? result.map(([, claim]) => claim)
                        .filter((claim) => activeIssuers.indexOf(claim.claim_issuer.toString()) !== -1)
                      : undefined))
                  .then((results) => {
                    dids.forEach((did, index) => {
                      const didClaims = results[index];

                      // Save CDD data
                      const cdd = didClaims && didClaims.length > 0 ? {
                        issuer: didClaims[0].claim_issuer.toString(),
                        expiry: !didClaims[0].expiry.isEmpty ? Number(didClaims[0].expiry.toString()) : undefined
                      } : undefined;

                      store.dispatch(identityActions.setIdentityCdd({ network, did, cdd }));
                    });
                  }, nonFatalErrorHandler)
                  .catch(nonFatalErrorHandler);
              }).then((unsub) => {
                unsubCallbacks.newHeads && unsubCallbacks.newHeads();
                unsubCallbacks.newHeads = unsub;
              }, nonFatalErrorHandler).catch(nonFatalErrorHandler);
            },
            nonFatalErrorHandler
          ).catch((err) => { nonFatalErrorHandler(err); destroy(network); });
        },
        (err) => { nonFatalErrorHandler(err); destroy(network); }
        ).catch((err) => { nonFatalErrorHandler(err); destroy(network); });
    }
  });

  return unsubAll;
}

export default subscribePolymesh;
