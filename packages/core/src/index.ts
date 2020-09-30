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
import { subscribeDidsList, subscribeNetwork } from './store/subscribers';

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

function meshAccountsEnhancer (dispatch: Dispatch): void {
  const unsubCallbacks: Record<string, UnsubCallback> = {};

  subscribeNetwork((network) => {
    dispatch(statusActions.setIsReady(false));
    // Unsubscribe from all subscriptions before preparing a new list of subscriptions
    // to the newly selected network.
    Object.keys(unsubCallbacks).forEach((key) => {
      unsubCallbacks[key]();
      delete unsubCallbacks[key];
    });

    apiPromise[network].then((api) => {
      let prevAccounts: string[] = [];
      let prevDids: string[] = [];
      let activeIssuers: string[] = [];

      api.query.cddServiceProviders.activeMembers((members) => {
        activeIssuers = (members as unknown as string[]).map((member) => member.toString());
      }).then((unsub) => {
        unsubCallbacks.activeMembers = unsub;
      }).catch(console.error);

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
          unsubCallbacks[account]();
          delete unsubCallbacks[account];
          dispatch(accountActions.removeAccount({ address: account, network }));
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

      unsubCallbacks.accounts = () => accountsSub.unsubscribe();

      // eslint-disable-next-line dot-notation
      unsubCallbacks['dids'] = subscribeDidsList((dids: string[]) => {
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
              unsubCallbacks[did] = unsub;
            })
            .catch(console.error);

          // Get the claims associated with this DID.
          (api.query.identity.claims.entries as any)(
            { target: did, claim_type: 'CustomerDueDiligence' },
            (res: [unknown, IdentityClaim][]) => {
              const claims = res
                .map(([, claim]) => claim)
                .filter((claim) => activeIssuers.indexOf(claim.claim_issuer.toString()) !== -1)
                .filter((claim) => claim.expiry.isEmpty || Number(claim.expiry.toString()) > Date.now());

              const cdd = claims.length > 0 ? {
                issuer: claims[0].claim_issuer.toString(),
                expiry: !claims[0].expiry.isEmpty ? Number(claims[0].expiry.toString()) : undefined
              } : undefined;

              dispatch(identityActions.setIdentityCdd({ network, did, cdd }));
            }
          ).then((unsub: UnsubCallback) => {
            unsubCallbacks[`${did}:cdd`] = unsub as unknown as UnsubCallback;
          })
            .catch(console.error);
        });

        removedDids.forEach((did) => {
          unsubCallbacks[did]();
          delete unsubCallbacks[did];
          unsubCallbacks[`${did}:cdd`]();
          delete unsubCallbacks[`${did}:cdd`];
        });

        prevDids = dids;
      });

      console.log('meshAccountsEnhancer initialization completed');
    }).catch((err) => console.error('meshAccountsEnhancer initialization failed', err));
  });
}

export default function init (): void {
  store.dispatch(meshAccountsEnhancer);
}
