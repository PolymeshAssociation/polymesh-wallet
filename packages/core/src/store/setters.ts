import store from '.';
import { NetworkName, Error } from '../types';
import { actions as networkActions } from './features/network';
import { actions as accountActions } from './features/accounts';
import { actions as identityActions } from './features/identities';
import { actions as statusActions } from './features/status';

function setNetwork (network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

function toggleIsDeveloper () {
  store.dispatch(networkActions.toggleIsDeveloper());
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

function setError (error: Error) {
  store.dispatch(statusActions.error(error));
}

export {
  setNetwork,
  setSelectedAccount,
  renameIdentity,
  setIsRehydrated,
  resetState,
  toggleIsDeveloper,
  setError
};
