// eslint-disable-next-line header/header
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Option } from '@polkadot/types/codec';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise from './api/apiPromise';
import { DidRecord, LinkedKeyInfo, IdentityClaim } from './api/apiPromise/types';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';

import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as statusActions } from './store/features/status';
import store, { Dispatch } from './store';
import { AccountData, IdentityData, UnsubCallback } from './types';
import { subscribeDidsList, subscribeIsRehydrated, subscribeNetwork } from './store/subscribers';
import { getDids } from './store/getters';
import { pollInterval } from './constants';

type KeyringAccountData = {
  address: string,
  name?: string,
}

function observeAccounts (cb: (accounts: KeyringAccountData[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address, meta: { name } } }) => ({ address, name }));

    cb(accounts);
  });
}

const unsubCallbacks: Record<string, UnsubCallback> = {};

function meshAccountsEnhancer (port: chrome.runtime.Port) {
  return (dispatch: Dispatch): void => {
    function unsubAll (): void {
      Object.keys(unsubCallbacks).forEach((key) => {
        if (unsubCallbacks[key]) {
          unsubCallbacks[key]();
          delete unsubCallbacks[key];
        }
      });
    }

    port.onDisconnect.addListener((): void => {
      unsubAll();
    });

    subscribeIsRehydrated((isRehydrated) => {
      if (isRehydrated) {
        subscribeNetwork((network) => {
          dispatch(statusActions.setIsReady(false));
          // Unsubscribe from all subscriptions before preparing a new list of subscriptions
          // to the newly selected network.
          unsubAll();

          apiPromise[network].then((api) => {
            let prevAccounts: string[] = [];
            let prevDids: string[] = [];
            let activeIssuers: string[] = [];

            api.query.cddServiceProviders.activeMembers().then(
              (members) => {
                activeIssuers = (members as unknown as string[]).map((member) => member.toString());

                const accountsSub = observeAccounts((accountsData: KeyringAccountData[]) => {
                  function accountName (_address: string): string | undefined {
                    return accountsData.find(({ address }) => address === _address)?.name;
                  }

                  const accounts = accountsData.map(({ address }) => address);
                  const newAccounts = difference(accounts, prevAccounts);
                  const removedAccounts = difference(prevAccounts, accounts);
                  const preExistingAccounts = intersection(prevAccounts, accounts);

                  // A) If account is removed, clean up any associated subscriptions
                  removedAccounts.forEach((account) => {
                    dispatch(accountActions.removeAccount({ address: account, network }));

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

                      dispatch(accountActions.setAccount({ data: accountData, network }));

                      if (!linkedKeyInfo.unwrapOrDefault().isEmpty) {
                        dispatch(identityActions.setIdentity({ data: {
                          did: linkedKeyInfo.unwrapOrDefault().asUnique.toString(),
                          priKey: account
                        },
                        network }));
                      }
                    }).then((unsub) => {
                      unsubCallbacks[account] && unsubCallbacks[account]();
                      unsubCallbacks[account] = unsub;
                    }).catch(console.error);
                  });

                  // C) Update data of pre-existing accounts.
                  preExistingAccounts.forEach((account) => {
                    const accountData: AccountData = {
                      address: account,
                      name: accountName(account)
                    };

                    dispatch(accountActions.setAccount({ data: accountData, network }));
                  });

                  dispatch(statusActions.setIsReady(true));
                  prevAccounts = accounts;
                });

                /**
                 * Accounts
                 */
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

                      dispatch(identityActions.setIdentity({ data: identityData, network }));
                    })
                      .then((unsub) => {
                        unsubCallbacks[did] && unsubCallbacks[did]();
                        unsubCallbacks[did] = unsub;
                      })
                      .catch(console.error);
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
                api.rpc.chain.subscribeNewHeads((newHeader) => {
                  // Run this every four block to save resources
                  if (newHeader.number.toNumber() % pollInterval === 0) return;
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

                        dispatch(identityActions.setIdentityCdd({ network, did, cdd }));
                      });
                    })
                    .catch(console.error);
                }).then((unsub) => {
                  unsubCallbacks.newHeads && unsubCallbacks.newHeads();
                  unsubCallbacks.newHeads = unsub;
                }).catch(console.error);
              }
            ).catch(console.error);

            console.log('meshAccountsEnhancer initialization completed');
          }).catch((err) => console.error('meshAccountsEnhancer initialization failed', err));
        });
      }
    });
  };
}

export default function init (port: chrome.runtime.Port): void {
  store.dispatch(meshAccountsEnhancer(port));
}
