import { accountsCount, network, networkUrl, selectedAccount, didsList, accountsAddresses } from './selectors';

import store from '.';
import { NetworkName } from '../types';

function getNetwork (): NetworkName {
  return network(store.getState());
}

function getNetworkUrl (): string {
  return networkUrl(store.getState());
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

export {
  getNetwork,
  getNetworkUrl,
  getSelectedAccount,
  getAccountsCount,
  getDids,
  getAccountsList
};
