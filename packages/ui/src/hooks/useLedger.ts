/* eslint-disable deprecation/deprecation */
import type { Network } from '@polkadot/networks/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';
import { knownLedger } from '@polkadot/networks/defaults';
import { assert } from '@polkadot/util';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { POLYMESH_GENERIC_SPEC_VERSION } from '@polymeshassociation/extension-core/constants';

import { ledgerChains } from '../util/chains';

interface StateBase {
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
}

export enum Status {
  Loading = 'Loading',
  Device = 'Device',
  App = 'App',
  Locked = 'Locked',
  Error = 'Error',
  Pending = 'Pending',
  Busy = 'Busy',
  Ok = 'Ok',
}

interface State extends StateBase {
  address: string | null;
  error: string | null;
  rawError: string | null;
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
  isLoading: boolean;
  isLocked: boolean;
  ledger: LedgerGeneric | Ledger | null;
  refresh: () => void;
  type: KeypairType | null;
  status: Status | null;
}

function getNetwork (genesis: string): Network | undefined {
  return ledgerChains.find(({ genesisHash }) => genesisHash[0] === genesis);
}

export function getStoredLedgerApp (): string | null {
  const stored = localStorage.getItem('poly:ledgerApp');

  if (stored === 'generic' || stored === 'polymesh') {
    return stored;
  }

  return null;
}

export function setStoredLedgerApp (app: string): void {
  localStorage.setItem('poly:ledgerApp', app);
}

/**
 * Classifies a raw Ledger error into a human-readable message and a Status value.
 * Single source of truth: both outputs derive from the same raw-message conditions,
 * eliminating fragile substring-matching on already-formatted strings.
 */
function processLedgerError (rawMessage: string): { message: string; status: Status } {
  const selectedApp = getStoredLedgerApp() ?? 'polymesh';
  const requiredApp = selectedApp === 'generic' ? 'Polkadot' : 'Polymesh';

  if (rawMessage.includes('Invalid channel') || rawMessage.includes('TransportError')) {
    return { message: 'Ledger communication error. Please ensure your device is unlocked and try again. If the error persists, disconnect and reconnect your Ledger device.', status: Status.Error };
  }

  // 0x5515 = LOCKED_DEVICE (21781).
  if (rawMessage.includes('21781')) {
    return { message: 'Your Ledger device is locked. Please unlock it and try again.', status: Status.Locked };
  }

  // 0x6e00 = CLA_NOT_SUPPORTED — wrong app open, or the app/firmware version is outdated.
  if (rawMessage.includes('28160') || rawMessage.includes('CLA Not Supported')) {
    return { message: `Your Ledger returned an unsupported command error. Ensure the ${requiredApp} app is open and up to date, and that your device firmware is current.`, status: Status.App };
  }

  // 0x6984 = DATA_INVALID — SLIP44 path rejected by the open app.
  // Each app strictly enforces its own SLIP44 path: the Polymesh app rejects the Polkadot
  // SLIP44 path, and the Polkadot Generic app rejects the Polymesh SLIP44 path.
  if (rawMessage.includes('27012') || rawMessage.includes('Data is invalid')) {
    return { message: `Please ensure the ${requiredApp} app is open on your Ledger device, or go to Ledger Settings to change the selected app.`, status: Status.App };
  }

  // 0x6986 = TRANSACTION_REJECTED (27014) — user dismissed the signing prompt on the device.
  if (rawMessage.includes('27014') || rawMessage.includes('Transaction rejected')) {
    return { message: 'The request was declined on the Ledger device.', status: Status.Error };
  }

  if (rawMessage.includes('App does not seem to be open')) {
    return { message: `The ${requiredApp} Ledger app does not seem to be open. Open the correct app on your device, or go to Ledger Settings to change the selected app.`, status: Status.App };
  }

  // 65535 / Unknown transport error — occurs after a USB reset failure (e.g. the stale
  // connection after unlocking the device). A second retry typically succeeds.
  if (rawMessage.includes('65535') || rawMessage.includes('Unknown transport error')) {
    return { message: 'Ledger connection failed. Please ensure your device is unlocked and try connecting again. If the error persists, disconnect and reconnect your Ledger device.', status: Status.Error };
  }

  // Generic fallback for any other unrecognised Ledger status code.
  if (rawMessage.includes('Unknown Status Code') || rawMessage.includes('Status Code:')) {
    return { message: 'An unexpected error occurred communicating with your Ledger. Please ensure the correct app is open, then try again.', status: Status.Error };
  }

  // Browser USB interface claim failure — another application or browser tab has exclusive access to the device.
  if (rawMessage.includes('Unable to claim interface') || rawMessage.includes('claimInterface')) {
    return { message: 'Your Ledger is already in use by another application or browser tab. Close any other app or tab using the device, then try again. If the issue persists, disconnect and reconnect your Ledger.', status: Status.Busy };
  }

  // No device connected or browser requires a user gesture to select a USB device.
  if (
    rawMessage.includes('No device selected') ||
    rawMessage.includes("Failed to execute 'requestDevice' on 'USB'")
  ) {
    return { message: rawMessage, status: Status.Device };
  }

  return { message: rawMessage, status: Status.Error };
}

/**
 * Returns the human-readable message for a raw Ledger error.
 * Exported so signing components can format errors outside useLedger's state machine.
 */
export function formatLedgerError (message: string): string {
  return processLedgerError(message).message;
}

function getState (): StateBase {
  const isLedgerCapable = !!(window as unknown as { USB?: unknown }).USB;

  return {
    isLedgerCapable,
    isLedgerEnabled: isLedgerCapable
  };
}

function retrieveLedger (genesis: string, specVersion?: number): LedgerGeneric | Ledger {
  const currApp = getStoredLedgerApp() ?? 'polymesh';
  const { isLedgerCapable } = getState();

  assert(isLedgerCapable, 'Incompatible browser, only Chrome is supported');

  // def may be undefined for development/unknown chains — only legacy (chainSpecific) requires it.
  const def = getNetwork(genesis);
  const network = def?.network ?? 'polymesh';

  // Chains below the threshold do not support Polkadot/Polymesh app signing.
  // Always use the legacy Ledger app regardless of user settings.
  // TODO: Remove this branch and the legacy Ledger class once all supported chains
  //       have been upgraded to spec version >= POLYMESH_GENERIC_SPEC_VERSION.
  if (specVersion !== undefined && specVersion < POLYMESH_GENERIC_SPEC_VERSION) {
    return new Ledger('webusb', network);
  }

  if (currApp === 'generic') {
    // Polkadot Generic app: always uses the Polkadot SLIP44 derivation path.
    return new LedgerGeneric('webusb', network, knownLedger.polkadot);
  } else if (currApp === 'polymesh') {
    // Polymesh app with explicit user selection: uses the Polymesh SLIP44 derivation path.
    return new LedgerGeneric('webusb', network, knownLedger.polymesh);
  }

  // Shouldn't happen that the app selection is invalid, but fall back to the chain's native SLIP44
  // entry, defaulting to the Polymesh SLIP44 if none is registered.
  const slip44 = knownLedger[network] ?? knownLedger.polymesh;

  return new LedgerGeneric('webusb', network, slip44);
}

export default function useLedger (
  genesis?: string | null,
  accountIndex = 0,
  addressOffset = 0,
  // TODO: Implement Ethereum/EVM account support — when true, use the Ethereum Ledger
  //       app with secp256k1 derivation (SLIP44 coin type 60) instead of the Substrate path.
  isEthereum = false,
  specVersion?: number
): State {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [type, setType] = useState<KeypairType | null>(null);

  const status: Status = useMemo((): Status => {
    if (rawError) {
      return processLedgerError(rawError).status;
    } else if (error) {
      // Error set without a raw device error (e.g. browser capability check).
      return Status.Error;
    } else if (isLoading) {
      return Status.Loading;
    } else if (address === null) {
      // No address, no error, not loading — waiting for the device to respond.
      return Status.Pending;
    } else {
      return Status.Ok;
    }
  }, [rawError, error, address, isLoading]);

  function handleGetAddressError (e: Error) {
    setIsLoading(false);

    const { message } = processLedgerError(e.message);

    setIsLocked(true);
    setRawError(e.message);
    setError(message);
    console.error(e);
    setAddress(null);
  }

  const { initError, ledger } = useMemo(() => {
    if (!genesis) {
      return { initError: null, ledger: null, refreshNonce };
    }

    try {
      return {
        initError: null,
        ledger: retrieveLedger(genesis, specVersion),
        refreshNonce
      };
    } catch (error) {
      return {
        initError: (error as Error).message,
        ledger: null,
        refreshNonce
      };
    }
  }, [genesis, refreshNonce, specVersion]);

  useEffect(() => {
    setAddress(null);
    setError(initError);
    setIsLoading(false);
    setIsLocked(false);
    setRawError(null);
    setType(null);
  }, [genesis, initError, ledger, specVersion]);

  useEffect(() => {
    if (!ledger || !genesis) {
      setAddress(null);
      setType(null);

      return;
    }

    let isStale = false;

    const handleGetAddressSuccess = (nextAddress: string, nextType: KeypairType) => {
      if (isStale) {
        return;
      }

      setIsLoading(false);
      setAddress(nextAddress);
      setType(nextType);
    };

    const handleGetAddressFailure = (e: Error) => {
      if (isStale) {
        return;
      }

      handleGetAddressError(e);
    };

    setIsLoading(true);
    setError(null);
    setRawError(null);

    const currApp = getStoredLedgerApp() ?? 'polymesh';
    const def = getNetwork(genesis);
    // Use the same app-selection logic as retrieveLedger: force legacy for old chains.
    // TODO: Remove the 'legacy' branch once all supported chains have been upgraded
    //       to spec version >= POLYMESH_GENERIC_SPEC_VERSION.
    const effectiveApp = (specVersion !== undefined && specVersion < POLYMESH_GENERIC_SPEC_VERSION)
      ? 'legacy'
      : currApp;

    if (effectiveApp === 'generic' || effectiveApp === 'polymesh') {
      // TODO: When isEthereum is true, derive via the Ethereum Ledger app using
      //       ETH-style derivation instead of the Substrate ss58 prefix path.
      (ledger as LedgerGeneric).getAddress(def?.prefix ?? 42, false, accountIndex, addressOffset)
        .then((res) => {
          handleGetAddressSuccess(res.address, 'ed25519');
        }).catch((e: Error) => {
          handleGetAddressFailure(e);
        });
    } else if (effectiveApp === 'legacy') {
      (ledger as Ledger).getAddress(false, accountIndex, addressOffset)
        .then((res) => {
          handleGetAddressSuccess(res.address, 'ed25519');
        }).catch((e: Error) => {
          handleGetAddressFailure(e);
        });
    }

    return () => {
      isStale = true;
    };
  }, [accountIndex, addressOffset, genesis, ledger, isEthereum, specVersion]);

  const refresh = useCallback(() => {
    setRefreshNonce((value) => value + 1);
    setError(null);
    setRawError(null);
    setIsLocked(false);
    setAddress(null);
    setType(null);
  }, []);

  return {
    ...getState(),
    address,
    error,
    isLoading,
    isLocked,
    ledger,
    rawError,
    refresh,
    status,
    type
  };
}
