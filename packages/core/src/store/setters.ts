import store from '.';
import { NetworkName } from '../types';
import { actions as networkActions } from './features/network';
import { actions as accountActions } from './features/accounts';
import { actions as identityActions } from './features/identities';
import { actions as statusActions } from './features/status';

function setNetwork (network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

function setSelectedAccount (account: string): void {
  store.dispatch(accountActions.selectAccount(account));
}

function renameIdentity (network: NetworkName, did: string, name: string) {
  store.dispatch(identityActions.renameIdentity({ network, did, name }));
}

function setIsRehydrated () {
  store.dispatch(statusActions.setRehydrated());
}

function resetState () {
  store.dispatch({ type: 'RESET' });
}

export {
  setNetwork,
  setSelectedAccount,
  renameIdentity,
  setIsRehydrated,
  resetState
};
