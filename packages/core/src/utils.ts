import { AccountData } from '@polkadot/types/interfaces';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { Subscription } from 'rxjs';

import { getDids } from './store/getters';
import { apiError, setError } from './store/setters';
import { defaultSs58Format } from './constants';
import {
  AccountBalances,
  ErrorCodes,
  KeyringAccountData,
} from './types';

// Sort an array by prioritizing a certain element
export function prioritize<P, T>(first: P, extractor: (a: T) => P) {
  return function (a: T): number {
    return first !== undefined ? (extractor(a) === first ? -1 : 1) : 0;
  };
}

export function observeAccounts(
  cb: (accounts: KeyringAccountData[]) => void
): Subscription {
  return accountsObservable.subject.subscribe(
    (accountsSubject: SubjectInfo) => {
      const accounts = Object.values(accountsSubject).map(
        ({
          json: {
            address,
            meta: { name },
          },
        }) => ({ address, name })
      );

      cb(accounts);
    }
  );
}

export const fatalErrorHandler = (error: Error): void =>
  error && setError({ code: ErrorCodes.FatalError, msg: error.message });

export const apiErrorHandler = (error: Error): void => {
  console.error(error);

  if (
    error &&
    !!error.message &&
    error.message.length &&
    !error.message.includes('Normal Closure')
  ) {
    setError({ code: ErrorCodes.NonFatalError, msg: error.message });
    apiError();
  }
};

export function subscribeOnlineStatus(cb: (status: boolean) => void): void {
  cb(navigator.onLine);
  window.addEventListener('offline', () => cb(false));
  window.addEventListener('online', () => cb(true));
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isWhitelisted = (whitelist: string[]) => {
  return (url: string): boolean => {
    try {
      const parsed = new URL(url);

      // Remove params, path and trailing slash
      parsed.search = '';
      parsed.pathname = '';
      const cleanUrl = parsed.toString().replace(/\/$/, '');

      return whitelist.includes(cleanUrl);
    } catch (error) {
      console.error('Error parsing app url', url, error);
    }

    return false;
  };
};

export const validateDid = (did: string): boolean => {
  const dids = getDids();

  if (dids.indexOf(did) === -1) {
    return false;
  }

  return true;
};

export const recodeAddress = (
  address: string,
  ss58Format = defaultSs58Format
): string => {
  return encodeAddress(decodeAddress(address), ss58Format);
};

export const accountBalances = ({
  free,
  miscFrozen,
  reserved,
}: AccountData): AccountBalances => {
  const total = free.add(reserved).toString();
  const transferrable = free.sub(miscFrozen).toString();
  const locked = reserved.add(miscFrozen).toString();

  return { total, transferrable, locked };
};
