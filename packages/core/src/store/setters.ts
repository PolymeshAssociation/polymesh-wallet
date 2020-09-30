import store from '.';
import { NetworkName } from '../types';
import { actions as networkActions } from './features/network';
import { actions as accountActions } from './features/accounts';
import { actions as identityActions } from './features/identities';

function setNetwork (network: NetworkName): void {
  store.dispatch(networkActions.setNetwork(network));
}

function setSelectedAccount (account: string): void {
  store.dispatch(accountActions.selectAccount(account));
}

function renameIdentity (network: NetworkName, did: string, name: string) {
  store.dispatch(identityActions.renameIdentity({ network, did, name }));
}

export {
  setNetwork,
  setSelectedAccount,
  renameIdentity
};
