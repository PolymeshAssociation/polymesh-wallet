import { IdentifiedAccount, NetworkName } from '../types';
import { accountsAddresses, accountsCount, didsList, identifiedAccounts, network, networkUrl, selectedAccount, selectedAccountIdentified } from './selectors';
import store from '.';

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

function getIdentifiedAccounts (): IdentifiedAccount[] {
  return identifiedAccounts(store.getState());
}

function getSelectedIdentifiedAccount (): IdentifiedAccount | undefined {
  return selectedAccountIdentified(store.getState());
}

export {
  getNetwork,
  getNetworkUrl,
  getSelectedAccount,
  getAccountsCount,
  getDids,
  getAccountsList,
  getIdentifiedAccounts,
  getSelectedIdentifiedAccount
};
