/* eslint-disable deprecation/deprecation */
import type { Network } from '@polkadot/networks/types';

import { Ledger } from '@polkadot/hw-ledger';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ledgerChains } from '../util/chains';

interface StateBase {
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
}

export enum Status {
  Loading = 'Loading',
  Device = 'Device',
  App = 'App',
  Error = 'Error',
  Pending = 'Pending',
  Busy = 'Busy',
  Ok = 'Ok',
}
interface State extends StateBase {
  address: string | null;
  error: string | null;
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
  isLoading: boolean;
  isLocked: boolean;
  ledger: Ledger | null;
  refresh: () => void;
  warning: string | null;
  status: Status | null;
}

function getNetwork (genesis: string): Network | undefined {
  return ledgerChains.find(({ genesisHash }) => genesisHash[0] === genesis);
}

function retrieveLedger (genesis: string): Ledger {
  let ledger: Ledger | null = null;

  const { isLedgerCapable } = getState();

  assert(isLedgerCapable, 'Incompatible browser, only Chrome is supported');

  const def = getNetwork(genesis);

  assert(def, `Unable to find supported chain for ${genesis}`);

  ledger = new Ledger('webusb', def.network);

  return ledger;
}

function getState (): StateBase {
  const isLedgerCapable = !!(window as unknown as { USB?: unknown }).USB;

  return {
    isLedgerCapable,
    isLedgerEnabled: isLedgerCapable && uiSettings.ledgerConn !== 'none'
  };
}

export function useLedger (
  genesis?: string | null,
  accountIndex = 0,
  addressOffset = 0,
  noAddress = false
): State {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [refreshLock, setRefreshLock] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const status: Status = useMemo((): Status => {
    if (error?.includes('does not seem to be open')) {
      return Status.App;
    } else if (error?.includes('Unable to claim interface')) {
      return Status.Busy;
    } else if (error?.includes('AbortError: The transfer was cancelled')) {
      return Status.Error;
    } else if (
      error?.includes('No device selected') ||
      error?.includes(
        "Failed to execute 'requestDevice' on 'USB': Must be handling a user gesture to show a permission request"
      ) ||
      // Strangely enough this error is thrown even while importing an account.
      // @FIXME distinguish it from actual tx rejection, once we're able to sign with ledger.
      error?.includes('Ledger error: Transaction rejected')
    ) {
      return Status.Device;
    } else if (error) {
      return Status.Error;
    } else if (isLoading) {
      return Status.Loading;
    } else if (error === null && address === null) {
      // NB: if Ledger is neither returning and address nor an error, then it is pending.
      return Status.Pending;
    } else {
      return Status.Ok;
    }
  }, [error, address, isLoading]);

  const ledger = useMemo(() => {
    setIsLocked(false);
    setRefreshLock(false);

    if (noAddress) {
      return null;
    }

    // this trick allows to refresh the ledger on demand
    // when it is shown as locked and the user has actually
    // unlocked it, which we can't know.
    if (refreshLock || genesis) {
      if (!genesis) {
        return null;
      }

      try {
        const ledger = retrieveLedger(genesis);

        return ledger;
      } catch (error) {
        setError((error as Error).message);
      }
    }

    return null;
  }, [genesis, refreshLock, noAddress]);

  useEffect(() => {
    if (!ledger || !genesis) {
      setAddress(null);

      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    // @FIXME sometimes ledger.getAddress neither resolves nor rejects.
    // Eg when another action is pending on ledger.
    ledger
      .getAddress(false, accountIndex, addressOffset)
      .then((res) => {
        setIsLoading(false);
        setAddress(res.address);
      })
      .catch((e: Error) => {
        setIsLoading(false);

        const { network } = getNetwork(genesis) || {
          network: 'unknown network'
        };

        const warningMessage = e.message.includes('Code: 26628')
          ? 'Is your ledger locked?'
          : null;

        const errorMessage = e.message.includes('App does not seem to be open')
          ? `App ${network} does not seem to be open`
          : e.message;

        setIsLocked(true);
        setWarning(warningMessage);
        setError(`Ledger error: ${errorMessage}`);
        console.error(e);
        setAddress(null);
      });
  }, [accountIndex, addressOffset, genesis, ledger]);

  const refresh = useCallback(() => {
    setRefreshLock(true);
    setError(null);
    setWarning(null);
  }, []);

  return {
    ...getState(),
    address,
    error,
    isLoading,
    isLocked,
    ledger,
    refresh,
    status,
    warning
  };
}
