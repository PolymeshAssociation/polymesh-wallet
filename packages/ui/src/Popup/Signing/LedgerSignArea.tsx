import type { ExtrinsicPayload } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useMemo, useState } from 'react';

import { ActionContext, Warning } from '@polymeshassociation/extension-ui/components';
import { Button, Flex } from '@polymeshassociation/extension-ui/ui';

import { Status, useLedger } from '../../hooks/useLedger';
import { cancelSignRequest } from '../../messaging';

interface Props {
  accountIndex?: number;
  addressOffset?: number;
  className?: string;
  error: string | null;
  genesisHash?: `0x${string}`;
  onSignature?: ({ signature }: { signature: `0x${string}` }) => void;
  payload?: ExtrinsicPayload;
  setError: (value: string | null) => void;
  signId: string;
}

function LedgerSignArea ({ accountIndex,
  addressOffset,
  error,
  genesisHash,
  onSignature,
  payload,
  setError,
  signId }: Props): React.ReactElement<Props> {
  const [isBusy, setIsBusy] = useState(false);
  const { error: ledgerError,
    isLoading: ledgerLoading,
    ledger,
    refresh,
    status: ledgerStatus } = useLedger(genesisHash, accountIndex, addressOffset);
  const onAction = useContext(ActionContext);

  const _onRefresh = useCallback(() => {
    refresh();
    setError(null);
  }, [refresh, setError]);

  const _onSignLedger = useCallback((): void => {
    if (!ledger || !payload || !onSignature) {
      return;
    }

    setError(null);
    setIsBusy(true);
    ledger
      .sign(payload.toU8a(true), accountIndex, addressOffset)
      .then((signature) => {
        onSignature(signature);
      })
      .catch((e: Error) => {
        setError(e.message);
        setIsBusy(false);
      });
  }, [accountIndex, addressOffset, ledger, onSignature, payload, setError]);

  const _onCancel = useCallback(() => {
    (async () => {
      await cancelSignRequest(signId);
      onAction();
    })().catch(console.error);
  }, [onAction, signId]);

  const warning = useMemo(() => {
    if (ledgerStatus === Status.Device) {
      return 'Please make sure that Ledger device is plugged and unlocked';
    } else if (ledgerStatus === Status.App) {
      return 'Please make sure that Ledger Polymesh App is installed on your device, and is open.';
    } else if (ledgerStatus === Status.Pending) {
      return 'An action is pending on your Ledger device.';
    } else if (ledgerStatus === Status.Busy) {
      return 'Unable to connect to Ledger device. Please see if another Polymesh extension popup is open.';
    } else if (ledgerError && ledgerStatus === Status.Error) {
      return ledgerError;
    } else {
      return null;
    }
  }, [ledgerStatus, ledgerError]);

  return (
    <Flex
      flexDirection='column'
      p='s'
    >
      {error && <Warning isDanger>{error}</Warning>}
      {warning && <Warning>{warning}</Warning>}
      <Flex
        alignItems='stretch'
        flexDirection='row'
        mt='s'
        width='100%'
      >
        <Flex flex={1}>
          <Button
            fluid
            onClick={_onCancel}
            variant='secondary'
          >
            Reject
          </Button>
        </Flex>
        <Flex
          flex={1}
          ml='xs'
        >
          {warning
            ? (
              <Button
                busy={isBusy || ledgerLoading}
                fluid
                onClick={_onRefresh}
                type='submit'
              >
                {'Refresh'}
              </Button>
            )
            : (
              <Button
                busy={isBusy || ledgerLoading}
                fluid
                onClick={_onSignLedger}
              >
                {'Sign on Ledger'}
              </Button>
            )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LedgerSignArea;
