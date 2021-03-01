import { Option } from '@polkadot/types/codec';
import { AccountInfo } from '@polkadot/types/interfaces/system';
import { encodeAddress } from '@polkadot/util-crypto';
import { union } from 'lodash-es';
import difference from 'lodash-es/difference';
import intersection from 'lodash-es/intersection';

import apiPromise, { disconnect } from './external/apiPromise';
import { DidRecord, IdentityClaim, LinkedKeyInfo } from './external/apiPromise/types';
import { actions as accountActions } from './store/features/accounts';
import { actions as identityActions } from './store/features/identities';
import { actions as statusActions } from './store/features/status';
import { getAccountsList, getNetwork } from './store/getters';
import { subscribeDidsList, subscribeIsHydratedAndNetwork } from './store/subscribers';
import { populatedDelay } from './constants';
import store from './store';
import { AccountData, KeyringAccountData, UnsubCallback } from './types';
import { nonFatalErrorHandler, observeAccounts } from './utils';

const unsubCallbacks: Record<string, UnsubCallback> = {};

let didCount = 0;

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

const _didRecord = (did: string, didRecords: DidRecord) => {
  const secKeys = didRecords.secondary_keys.toArray().reduce((keys, item) => {
    return item.signer.isAccount
      ? keys.concat(encodeAddress(item.signer.asAccount))
      : keys;
  }, [] as string[]);

  const identityData = {
    did,
    priKey: encodeAddress(didRecords.primary_key),
    secKeys
  };

  return identityData;
};

const claims2Record = (didClaims: IdentityClaim[]) => {
  // Sort claims array by expiry (non-expiring first)
  const didClaimsSorted = didClaims.sort(claimSorter);

  // Save CDD data
  const cdd = didClaimsSorted && didClaimsSorted.length > 0
    ? {
      issuer: didClaimsSorted[0].claim_issuer.toString(),
      expiry: !didClaimsSorted[0].expiry.isEmpty ? Number(didClaimsSorted[0].expiry.toString()) : undefined
    }
    : undefined;

  return cdd;
};

function subscribePolymesh (): () => Promise<void> {
  function unsubAll (): Promise<void> {
    for (const key in unsubCallbacks) {
      if (unsubCallbacks[key]) {
        try {
          console.log('Poly: Unsubscribing from:', key);
          unsubCallbacks[key]();
          delete unsubCallbacks[key];
        } catch (error) {
          console.error(error);
        }
      }
    }

    return disconnect();
  }

  console.log('Poly: subscribePolymesh');

  !!unsubCallbacks.network && unsubCallbacks.network();
  unsubCallbacks.network = subscribeIsHydratedAndNetwork((network) => {
    if (network) {
      console.log('Poly: selected network', network);
      store.dispatch(statusActions.init());

      apiPromise(network)
        .then((api) => {
          didCount = 0;

          // Clear errors
          store.dispatch(statusActions.apiReady());

          setTimeout(() => {
            store.dispatch(statusActions.populated(network));
          }, populatedDelay);

          let prevAccounts: string[] = [];
          let prevDids: string[] = [];
          let activeIssuers: string[] = [];

          api.query.cddServiceProviders.activeMembers().then(
            (members) => {
              activeIssuers = (members as unknown as string[]).map((member) => member.toString());

              /**
               * Accounts
               */
              console.log('Poly: Subscribing to accounts');
              const accountsSub = observeAccounts((accountsData: KeyringAccountData[]) => {
                if (network !== getNetwork()) { return; }

                function accountName (_address: string): string | undefined {
                  return accountsData.find(({ address }) => address === _address)?.name;
                }

                const accounts = accountsData.map(({ address }) => address);

                // A) Clean subscriptions of previous accounts list
                prevAccounts.forEach((account) => {
                  if (unsubCallbacks[account]) {
                    unsubCallbacks[account]();
                    delete unsubCallbacks[account];
                  }
                });

                // B) Create new subscriptions to:
                accounts.forEach((account) => {
                  api.queryMulti([
                    // 1) Account balance
                    [api.query.system.account, account],
                    // 2) Identities linked to account.
                    [api.query.identity.keyToIdentityIds, account]
                  ], ([accData, linkedKeyInfo]: [AccountInfo, Option<LinkedKeyInfo>]) => {
                    // Store account metadata
                    store.dispatch(accountActions.setAccount({ data: {
                      address: account,
                      balance: accData.data.free.toString(),
                      name: accountName(account)
                    },
                    network }));

                    if (linkedKeyInfo.isEmpty) { return; }

                    const did = linkedKeyInfo.toString();

                    api.query.identity.didRecords<DidRecord>(did).then((didRecords) => {
                      const data = _didRecord(did, didRecords);
                      const params = { did, network, data };

                      console.log(`Poly: Setting **identity** ${didCount++}`, data);
                      // store.dispatch(identityActions.setIdentitySecKeys(params));
                      store.dispatch(identityActions.setIdentity(params));
                    }, nonFatalErrorHandler)
                      .catch(nonFatalErrorHandler);
                  }).then((unsub) => {
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
              console.log('Poly: Subscribing to dids');

              unsubCallbacks.dids = subscribeDidsList((dids: string[]) => {
                if (network !== getNetwork()) { return; }

                console.log('Poly: subscribeDidsList', network, getNetwork(), dids);

                const removedDids = difference(prevDids, dids);

                removedDids.forEach((did) => {
                  store.dispatch(identityActions.removeIdentity({ network, did }));

                  if (unsubCallbacks[did]) {
                    unsubCallbacks[did]();
                    delete unsubCallbacks[did];
                  }

                  if (unsubCallbacks[`${did}:cdd`]) {
                    unsubCallbacks[`${did}:cdd`]();
                    delete unsubCallbacks[`${did}:cdd`];
                  }
                });

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
                      const result = results[index];

                      if (result) {
                        const cdd = claims2Record(result);

                        store.dispatch(identityActions.setIdentityCdd({ network, did, cdd }));
                      }
                    });
                  }, nonFatalErrorHandler)
                  .catch(nonFatalErrorHandler);

                prevDids = dids;
              });
            },
            nonFatalErrorHandler
          ).catch((err) => {
            nonFatalErrorHandler(err);
          });
        }, nonFatalErrorHandler
        ).catch(nonFatalErrorHandler);
    }
  });

  return unsubAll;
}

export default subscribePolymesh;
