import { Error, NetworkName } from '../types';
import { actions as accountActions } from './features/accounts';
import { actions as identityActions } from './features/identities';
import { actions as networkActions } from './features/network';
import { actions as statusActions } from './features/status';
import store from '.';

function setNetwork(network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

function toggleIsDeveloper() {
  store.dispatch(networkActions.toggleIsDeveloper());
}

function setSelectedAccount(account: string): void {
  store.dispatch(accountActions.selectAccount(account));
}

function renameIdentity(network: NetworkName, did: string, name: string) {
  store.dispatch(identityActions.renameIdentity({ network, did, name }));
}

function resetState() {
  store.dispatch({ type: 'RESET' });
}

function setError(error: Error) {
  store.dispatch(statusActions.error(error));
}

export function apiError() {
  store.dispatch(statusActions.apiError());
}

export {
  setNetwork,
  setSelectedAccount,
  renameIdentity,
  resetState,
  toggleIsDeveloper,
  setError,
};
