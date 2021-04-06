import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import { getDids } from './store/getters';
import { apiError, setError } from './store/setters';
import { defaultSs58Format, uidProvidersWhitelist } from './constants';
import { ErrorCodes, KeyringAccountData, NetworkName } from './types';

// Sort an array by prioritizing a certain element
export function prioritize<P, T> (first: P, extractor: (a: T) => P) {
  return function (a: T, b: T): number {
    return first !== undefined ? extractor(a) === first ? -1 : 1 : 0;
  };
}

export function observeAccounts (cb: (accounts: KeyringAccountData[]) => void) {
  return accountsObservable.subject.subscribe((accountsSubject: SubjectInfo) => {
    const accounts = Object.values(accountsSubject).map(({ json: { address, meta: { name } } }) => ({ address, name }));

    cb(accounts);
  });
}

export const fatalErrorHandler = (error: Error): void => error && setError({ code: ErrorCodes.FatalError, msg: error.message });

export const apiErrorHandler = (error: Error): void => {
  if (error && !!error.message && error.message.length) {
    setError({ code: ErrorCodes.NonFatalError, msg: error.message });
    apiError();
  }
};

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

    // Remove params, path and trailing slash
    parsed.search = '';
    parsed.pathname = '';
    const cleanUrl = parsed.toString().replace(/\/$/, '');

    return uidProvidersWhitelist.includes(cleanUrl);
  } catch (error) {
    console.error('Error parsing app url', url, error);
  }

  return false;
};

export const validateTicker = (ticker: string): boolean => {
  return !!ticker &&
    typeof ticker === 'string' &&
    ticker.length > 0 &&
    ticker.length <= 12 &&
    !!(/^[a-zA-Z0-9\-:]*$/.exec(ticker));
};

export const validateNetwork = (network: string): boolean => {
  return !!network &&
    Object.keys(NetworkName).indexOf(network) > -1;
};

export const validateDid = (did: string): boolean => {
  const dids = getDids();

  if (dids.indexOf(did) === -1) {
    return false;
  }

  return true;
};

export const validateUid = (uid: string): boolean => {
  return uuidValidate(uid) && uuidVersion(uid) === 4;
};

export const recodeAddress = (address: string, ss58Format = defaultSs58Format): string => {
  return encodeAddress(decodeAddress(address), ss58Format);
};
