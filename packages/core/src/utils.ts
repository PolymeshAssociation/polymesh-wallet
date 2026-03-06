import type { AccountData, Balance } from '@polkadot/types/interfaces';
import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { BN } from '@polkadot/util';
import type { Subscription } from 'rxjs';
import type { AccountBalances, KeyringAccountData } from './types';

import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { BN_ZERO, bnMax } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { getDids } from './store/getters';
import { apiError, setError } from './store/setters';
import { defaultSs58Format } from './constants';
import { ErrorCodes } from './types';

// Sort an array by prioritizing a certain element
export function prioritize<P, T> (first: P, extractor: (a: T) => P) {
  return function (a: T): number {
    return first !== undefined ? (extractor(a) === first ? -1 : 1) : 0;
  };
}

export function observeAccounts (
  cb: (accounts: KeyringAccountData[]) => void
): Subscription {
  return accountsObservable.subject.subscribe(
    (accountsSubject: SubjectInfo) => {
      const accounts = Object.values(accountsSubject).map(
        ({ json: { address,
          meta: { name } } }) => ({ address, name })
      );

      cb(accounts);
    }
  );
}

export const fatalErrorHandler = (error: Error): void => {
  if (error) {
    console.error('initialization failed', error);
    setError({ code: ErrorCodes.FatalError, msg: error.message });
  }
};

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

export function subscribeOnlineStatus (onStatusChange: (status: boolean) => void): void {
  onStatusChange(navigator.onLine);
  window.addEventListener('offline', () => onStatusChange(false));
  window.addEventListener('online', () => onStatusChange(true));
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

  if (!dids.includes(did)) {
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

/**
 * Calculate account balance metrics from system.account data.
 * Handles both Substrate pre-1.0 (Polymesh pre v8: miscFrozen/feeFrozen) and Substrate 1.0+ (Polymesh V8+: frozen) formats.
 *
 * V7 semantics: free = usable balance, miscFrozen/feeFrozen = locks on free
 * V8 semantics: free = liquid balance, frozen = max lock (can overlap with reserved/holds)
 *
 * The V8 logic follows polkadot api-derive's calcShared:
 * - reserved (holds) can absorb part or all of frozen (locks)
 * - only the excess of frozen beyond reserved restricts free balance
 * - existential deposit (ED) is subtracted from transferrable when frozen or reserved exist
 *
 * @param accountData - AccountData from system.account query
 * @param ed - Existential deposit (from api.consts.balances.existentialDeposit), optional
 */
export const accountBalances = (
  { feeFrozen, free, frozen, miscFrozen, reserved }: AccountData & { feeFrozen?: Balance; frozen?: Balance },
  ed?: BN
): AccountBalances => {
  const total = free.add(reserved).toString();

  if (frozen !== undefined) {
    // V8 / Substrate 1.0+ path: frozen field present
    const noFrozenReserved = frozen.isZero() && reserved.isZero();
    const maybeED = noFrozenReserved ? BN_ZERO : (ed ?? BN_ZERO);
    const frozenMinusReserved = frozen.sub(reserved);
    const transferrable = bnMax(BN_ZERO, free.sub(bnMax(maybeED, frozenMinusReserved))).toString();
    const locked = bnMax(reserved, frozen).toString();

    return { locked, total, transferrable };
  } else {
    // V7 / Substrate pre-1.0 path: miscFrozen/feeFrozen fields
    const effectiveFrozen = bnMax(miscFrozen ?? BN_ZERO, feeFrozen ?? BN_ZERO);
    const transferrable = bnMax(BN_ZERO, free.sub(effectiveFrozen)).toString();
    const locked = reserved.add(effectiveFrozen).toString();

    return { locked, total, transferrable };
  }
};
