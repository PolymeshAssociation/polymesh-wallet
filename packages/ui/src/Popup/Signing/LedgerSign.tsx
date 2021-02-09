import type { ExtrinsicPayload } from '@polkadot/types/interfaces';

import { Button } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { ActivityContext, Warning } from '../../components';
import { useLedger } from '../../hooks/useLedger';

interface Props {
  accountIndex?: number;
  addressOffset? : number;
  className?: string;
  error: string | null;
  genesisHash?: string;
  onSignature?: ({ signature }: { signature: string }) => void;
  payload?: ExtrinsicPayload;
  setError: (value: string | null) => void;
}

function LedgerSign ({ accountIndex, addressOffset, className, error, genesisHash, onSignature, payload, setError } : Props): React.ReactElement<Props> {
  const { error: ledgerError, isLoading: ledgerLoading, isLocked: ledgerLocked, ledger, refresh, warning: ledgerWarning } = useLedger(genesisHash, accountIndex, addressOffset);
  const isBusy = useContext(ActivityContext);

  useEffect(() => {
    if (ledgerError) {
      setError(ledgerError);
    }
  }, [ledgerError, setError]);

  const _onRefresh = useCallback(() => {
    refresh();
    setError(null);
  }, [refresh, setError]);

  const _onSignLedger = useCallback(
    (): void => {
      if (!ledger || !payload || !onSignature) {
        return;
      }

      setError(null);
      ledger.sign(payload.toU8a(true), accountIndex, addressOffset)
        .then((signature) => {
          onSignature(signature);
        }).catch((e: Error) => {
          setError(e.message);
        });
    },
    [accountIndex, addressOffset, ledger, onSignature, payload, setError]
  );

  return (
    <div className={className}>
      {!!ledgerWarning && (
        <Warning>
          {ledgerWarning}
        </Warning>
      )}
      {error && (
        <Warning isDanger>
          {error}
        </Warning>
      )}
      {ledgerLocked
        ? (
          <Button
            busy={isBusy || ledgerLoading}
            onClick={_onRefresh}
          >
            {'Refresh'}
          </Button>
        )
        : (
          <Button
            busy={isBusy || ledgerLoading}
            onClick={_onSignLedger}
          >
            {'Sign on Ledger'}
          </Button>
        )
      }
    </div>

  );
}

export default styled(LedgerSign)`
  flex-direction: column;
  padding: 6px 24px;

  .danger {
    margin-bottom: .5rem;
  }
`;
