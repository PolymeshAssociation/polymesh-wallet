import type { IdentifiedAccount, NetworkName } from '../types';

import { accountsAddresses, accountsCount, customNetworkUrl, didsList, identifiedAccounts, networkUrl, selectedAccount, selectedNetwork } from './selectors';
import store from '.';

function getNetwork (): NetworkName {
  return selectedNetwork(store.getState());
}

function getNetworkUrl (): string {
  return networkUrl(store.getState());
}

function getCustomNetworkUrl (): string {
  return customNetworkUrl(store.getState());
}

function getSelectedAccount (): string | undefined {
  return selectedAccount(store.getState());
}

function getAccountsCount (): number {
  return accountsCount(store.getState());
}

function getDids (): string[] {
  return didsList(store.getState());
}

function getAccountsList (): string[] {
  return accountsAddresses(store.getState());
}

function getIdentifiedAccounts (): IdentifiedAccount[] {
  return identifiedAccounts(store.getState());
}

export { getAccountsCount,
  getAccountsList,
  getCustomNetworkUrl,
  getDids,
  getIdentifiedAccounts,
  getNetwork,
  getNetworkUrl,
  getSelectedAccount };
