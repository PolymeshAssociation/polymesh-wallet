import { Ledger } from '@polkadot/hw-ledger';
import { Network } from '@polkadot/networks/types';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ledgerChains from '../util/legerChains';

interface StateBase {
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
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
}

function getNetwork (genesis: string): Network | undefined {
  return ledgerChains.find(({ genesisHash }) => genesisHash[0] === genesis);
}

function retrieveLedger (genesis: string): Ledger {
  let ledger: Ledger | null = null;

  const { isLedgerCapable } = getState();

  assert(isLedgerCapable, 'Incompatible browser, only Chrome is supported');

  // const def = getNetwork(genesis);

  // assert(def, `Unable to find supported chain for ${genesis}`);

  ledger = new Ledger('webusb', 'polymesh');

  return ledger;
}

function getState (): StateBase {
  const isLedgerCapable = !!(window as unknown as { USB?: unknown }).USB;

  return {
    isLedgerCapable,
    isLedgerEnabled: isLedgerCapable && uiSettings.ledgerConn !== 'none'
  };
}

export function useLedger (genesis?: string | null, accountIndex = 0, addressOffset = 0): State {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [refreshLock, setRefreshLock] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const ledger = useMemo(() => {
    setIsLocked(false);
    setRefreshLock(false);

    // this trick allows to refresh the ledger on demand
    // when it is shown as locked and the user has actually
    // unlocked it, which we can't know.
    if (refreshLock || genesis) {
      if (!genesis) {
        return null;
      }

      return retrieveLedger(genesis);
    }

    return null;
  }, [genesis, refreshLock]);

  useEffect(() => {
    if (!ledger || !genesis) {
      setAddress(null);

      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);

    ledger.getAddress(false, accountIndex, addressOffset)
      .then((res) => {
        setIsLoading(false);
        setAddress(res.address);
      }).catch((e: Error) => {
        setIsLoading(false);

        const { network } = getNetwork(genesis) || { network: 'unknown network' };

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

  return ({ ...getState(), address, error, isLoading, isLocked, ledger, refresh, warning });
}
