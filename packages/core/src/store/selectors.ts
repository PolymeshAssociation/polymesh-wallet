import { createSelector } from '@reduxjs/toolkit';

import { networkURLs } from '../constants';
import { DidType, ReversedDidList } from '../types';
import { RootState } from './rootReducer';

export const network = createSelector(
  (state: RootState) => state.network,
  (network) => network.selected
);

export const networkUrl = createSelector(
  network,
  (network) => networkURLs[network]
);

export const didsList = createSelector(
  (state: RootState) => state.identities,
  network,
  (identities, network) => Object.keys(identities[network])
);

export const reversedDidList = createSelector(
  (state: RootState) => state.identities,
  network,
  (identities, network): ReversedDidList => {
    return Object.keys(identities[network]).reduce((reversedList: ReversedDidList, did) => {
      const identity = identities[network][did];
      const data = { cdd: identity.cdd, did, didAlias: identity.alias || '' };

      reversedList[identity.priKey] = { ...data, keyType: DidType.primary };

      identity.secKeys?.forEach((secKey) => {
        reversedList[secKey] = { ...data, keyType: DidType.secondary };
      });

      return reversedList;
    }, {} as ReversedDidList);
  }
);

export const accounts = createSelector(
  network,
  (state: RootState) => state.accounts,
  (network, accounts) => accounts[network]
);

export const accountsAddresses = createSelector(
  accounts,
  (accounts) => Object.keys(accounts)
);

export const accountsCount = createSelector(
  accounts,
  (accounts): number => Object.values(accounts).length
);

export const identifiedAccounts = createSelector(
  accounts,
  reversedDidList,
  (accounts, reversedDidList: ReversedDidList) => {
    return Object.values(accounts).map((account) => ({ ...account, ...reversedDidList[account.address] }));
  }
);

export const selectedAccount = createSelector(
  (state: RootState) => state.accounts.selected,
  accounts,
  (account, accounts) => {
    if (account && accounts[account]) {
      return account;
    } else if (Object.keys(accounts).length) {
      return Object.values(accounts)[0].address;
    }

    return undefined;
  }
);

export const selectedAccountIdentified = createSelector(
  selectedAccount,
  identifiedAccounts,
  (selectedAccount, identifiedAccounts) => {
    if (selectedAccount) {
      return identifiedAccounts.filter((account) => account.address === selectedAccount)[0];
    }

    return undefined;
  }
);

export const selectIsRehydrated = createSelector(
  (state: RootState) => state.status,
  ({ rehydrated }) => rehydrated
);

export const selectIsHydratedAndNetwork = createSelector(
  selectIsRehydrated,
  network,
  (isHydrated, network) => { return isHydrated ? network : undefined; }
);

export const selectStatus = createSelector(
  (state: RootState) => state.status,
  // Status will always be "ready" if we're offline
  (status) => ({ ...status, ready: !navigator.onLine || status.ready })
);

export const selectIsDev = createSelector(
  (state: RootState) => state.network,
  ({ isDeveloper }) => isDeveloper ? 'true' : 'false'
);
