import { Unsubscribe } from '@reduxjs/toolkit';
import { IdentifiedAccount, NetworkName, StoreStatus } from '../types';
import reduxSubscribe from './reduxSubscribe';
import { accountsCount, didsList, identifiedAccounts, selectStatus, network, selectedAccount, selectIsRehydrated, selectIsHydratedAndNetwork } from './selectors';

export function subscribeDidsList (cb: (dids: string[]) => void): Unsubscribe {
  return reduxSubscribe(didsList, cb);
}

export function subscribeIdentifiedAccounts (cb: (accounts: IdentifiedAccount[]) => void): Unsubscribe {
  return reduxSubscribe(identifiedAccounts, cb);
}

export function subscribeNetwork (cb: (network: NetworkName) => void): Unsubscribe {
  return reduxSubscribe(network, cb);
}

export function subscribeSelectedAccount (cb: (selected: string | undefined) => void): Unsubscribe {
  return reduxSubscribe(selectedAccount, cb);
}

export function subscribeAccountsCount (cb: (count: number) => void): Unsubscribe {
  return reduxSubscribe(accountsCount, cb);
}

export function subscribeStatus (cb: (status: StoreStatus) => void): Unsubscribe {
  return reduxSubscribe(selectStatus, cb);
}

export function subscribeIsRehydrated (cb: (isRehydrated: boolean) => void): Unsubscribe {
  return reduxSubscribe(selectIsRehydrated, cb);
}

export function subscribeIsHydratedAndNetwork (cb: (network: NetworkName | undefined) => void): Unsubscribe {
  return reduxSubscribe(selectIsHydratedAndNetwork, cb);
}
