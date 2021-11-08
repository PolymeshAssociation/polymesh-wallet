import { Unsubscribe } from '@reduxjs/toolkit';

import {
  IdentifiedAccount,
  NetworkName,
  NetworkState,
  StoreStatus,
} from '../types';
import reduxSubscribe from './reduxSubscribe';
import {
  accountsCount,
  didsList,
  identifiedAccounts,
  network,
  selectedAccount,
  selectedNetwork,
  selectStatus,
} from './selectors';

export function subscribeDidsList(cb: (dids: string[]) => void): Unsubscribe {
  return reduxSubscribe(didsList, cb);
}

export function subscribeIdentifiedAccounts(
  cb: (accounts: IdentifiedAccount[]) => void
): Unsubscribe {
  return reduxSubscribe(identifiedAccounts, cb);
}

export function subscribeSelectedNetwork(
  cb: (network: NetworkName) => void
): Unsubscribe {
  return reduxSubscribe(selectedNetwork, cb);
}

export function subscribeNetworkState(
  cb: (networkState: NetworkState) => void
): Unsubscribe {
  return reduxSubscribe(network, cb);
}

export function subscribeSelectedAccount(
  cb: (selected: string | undefined) => void
): Unsubscribe {
  return reduxSubscribe(selectedAccount, cb);
}

export function subscribeAccountsCount(
  cb: (count: number) => void
): Unsubscribe {
  return reduxSubscribe(accountsCount, cb);
}

export function subscribeStatus(
  cb: (status: StoreStatus) => void
): Unsubscribe {
  return reduxSubscribe(selectStatus, cb);
}
