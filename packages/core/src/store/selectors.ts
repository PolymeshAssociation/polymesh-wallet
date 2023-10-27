import { createSelector } from '@reduxjs/toolkit';

import { networkURLs } from '../constants';
import { DidType, ReversedDidList, NetworkName } from '../types';
import { RootState } from './rootReducer';

export const network = createSelector(
  (state: RootState) => state.network,
  (network) => network
);

export const selectedNetwork = createSelector(
  network,
  (network) => network.selected
);

export const networkUrl = createSelector(
  network,
  ({ selected, customNetworkUrl }) =>
    selected === NetworkName.custom ? customNetworkUrl : networkURLs[selected]
);

export const customNetworkUrl = createSelector(
  network,
  ({ customNetworkUrl }) => customNetworkUrl
);

export const didsList = createSelector(
  (state: RootState) => state.identities,
  (identities) => Object.values(identities.currentDids)
);

export const reversedDidList = createSelector(
  (state: RootState) => state.identities,
  ({ dids, currentDids }): ReversedDidList => {
    return Object.keys(currentDids).reduce(
      (reversedList: ReversedDidList, account) => {
        const did = currentDids[account];
        const identity = dids[did];

        if (!identity) {
          return {}
        }
        const data = { cdd: identity.cdd, did: identity.did, didAlias: identity.alias || '' };

        reversedList[account] = { ...data, keyType: DidType.primary };

        identity.secKeys?.forEach((secKey) => {
          reversedList[secKey] = { ...data, keyType: DidType.secondary };
        });

        identity.msKeys?.forEach((msKey) => {
          reversedList[msKey] = { ...data, keyType: DidType.multisig };
        });

        return reversedList;
      },
      {} as ReversedDidList
    );
  }
);

export const accounts = createSelector(
  selectedNetwork,
  (state: RootState) => state.accounts,
  (network, accounts) => accounts[network]
);

export const accountsAddresses = createSelector(accounts, (accounts) =>
  Object.keys(accounts)
);

export const accountsCount = createSelector(
  accounts,
  (accounts): number => Object.values(accounts).length
);

export const identifiedAccounts = createSelector(
  accounts,
  reversedDidList,
  (accounts, reversedDidList: ReversedDidList) => Object.values(accounts).map((account) => ({
    ...account,
    ...reversedDidList[account.address]
  }))
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

export const selectStatus = createSelector(
  (state: RootState) => state.status,
  (status) => status
);
