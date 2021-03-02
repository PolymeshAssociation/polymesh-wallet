import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import { setError } from './store/setters';
import { messagePrefix, messages, uidProvidersWhitelist } from './constants';
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

export const nonFatalErrorHandler = (error: Error): void =>
  error && !!error.message && error.message.length ? setError({ code: ErrorCodes.NonFatalError, msg: error.message }) : undefined;

export function subscribeOnlineStatus (cb: (status: boolean) => void): void {
  cb(navigator.onLine);
  // eslint-disable-next-line node/no-callback-literal
  window.addEventListener('offline', () => cb(false));
  // eslint-disable-next-line node/no-callback-literal
  window.addEventListener('online', () => cb(true));
}

export const sleep = (ms: number):Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const allowedUidProvider = (url: string): boolean => {
  try {
    const parsed = new URL(url);

    // Remove params and trailing slash
    parsed.search = '';
    const cleanUrl = parsed.toString().replace(/\/$/, '');

    return uidProvidersWhitelist.includes(cleanUrl);
  } catch (error) {
    console.error('Error parsing app url', url, error);
  }

  return false;
};
