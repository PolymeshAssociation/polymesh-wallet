import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import { setError } from './store/setters';
import { messagePrefix, messages } from './constants';
import { ErrorCodes, KeyringAccountData } from './types';

// Sort an array by prioritizing a certain element
export function prioritize<P, T> (first: P, extractor: (a: T) => P) {
  return function (a: T, b: T): number {
    return first !== undefined ? extractor(a) === first ? -1 : 1 : 0;
  };
}

export function isPolyMessage (message: string): boolean {
  const isPolyMessage = message.indexOf(messagePrefix) === 0 || messages.indexOf(message) > -1;

  return isPolyMessage;
}

export function observeAccounts (cb: (accounts: KeyringAccountData[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address, meta: { name } } }) => ({ address, name }));

    cb(accounts);
  });
}

export const fatalErrorHandler = (error: Error): void => error && setError({ code: ErrorCodes.FatalError, msg: error.message });

export const nonFatalErrorHandler = (error: Error): void => {
  if (error) {
    setError({ code: ErrorCodes.NonFatalError, msg: error.message });
    console.error('BG ERROR', error);
  }
};

export function subscribeOnlineStatus (cb: (status: boolean) => void): void {
  cb(navigator.onLine);
  // eslint-disable-next-line node/no-callback-literal
  window.addEventListener('offline', () => cb(false));
  // eslint-disable-next-line node/no-callback-literal
  window.addEventListener('online', () => cb(true));
}
