import settings from '@polkadot/ui-settings';
import { genesisHash } from '@polymathnetwork/extension-core/constants';
import { ActionContext, ActivityContext } from '@polymathnetwork/extension-ui/components/contexts';
import Dropdown from '@polymathnetwork/extension-ui/components/Dropdown';
import Name from '@polymathnetwork/extension-ui/components/Name';
import { useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { createAccountHardware } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { TroubleshootInfo } from './TroubleshootInfo';

interface AccOption {
  text: string;
  value: number;
}

const AVAIL: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function ImportLedger (): React.ReactElement {
  const genesis = genesisHash;

  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [addressOffset, setAddressOffset] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const onAction = useContext(ActionContext);
  const [name, setName] = useState<string | null>(null);
  const { address, error: ledgerError, isLoading: ledgerLoading, isLocked: ledgerLocked, refresh, warning: ledgerWarning } = useLedger(genesis, accountIndex, addressOffset);
  const isBusy = useContext(ActivityContext);

  console.log('address', address);

  useEffect(() => {
    if (address) {
      settings.set({ ledgerConn: 'webusb' });
    }
  }, [address]);

  const accOps = useRef(AVAIL.map((value): AccOption => ({
    text: `Account type ${value}`,
    value
  })));

  const addOps = useRef(AVAIL.map((value): AccOption => ({
    text: `Address index ${value}`,
    value
  })));

  const _onSave = useCallback(
    () => {
      if (address && genesis && name) {
        createAccountHardware(address, 'ledger', accountIndex, addressOffset, name, genesis)
          .then(() => onAction('/'))
          .catch((error: Error) => {
            console.error(error);

            setError(error.message);
          });
      }
    },
    [accountIndex, address, addressOffset, genesis, name, onAction]
  );

  // select element is returning a string
  const _onSetAccountIndex = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setAccountIndex(Number(event.target.value)), []);
  const _onSetAddressOffset = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setAddressOffset(Number(event.target.value)), []);

  // console.log({ error, ledgerError });

  return (
    <Box p='xs'>
      <TroubleshootInfo error={error || ledgerError}
        refresh={refresh} />
      <div>
        <div>{address}</div>
        <div>{name}</div>
        {
          !!genesis &&
          !!address && !ledgerError && (
            <Name
              onChange={setName}
              value={name || ''}
            />
          )}
        { !!name && (
          <>
            <Dropdown
              className='accountType'
              disabled={ledgerLoading}
              onChange={_onSetAccountIndex}
              options={accOps.current}
              value={accountIndex}
            />
            <Dropdown
              className='accountIndex'
              disabled={ledgerLoading}
              onChange={_onSetAddressOffset}
              options={addOps.current}
              value={addressOffset}
            />
          </>
        )}
        {!!ledgerWarning && (
          { ledgerWarning }
        )}
        {/* {(!!error || !!ledgerError) && (
          <div>
            {error || ledgerError}
          </div>
        )} */}
      </div>
      {ledgerLocked
        ? (
          'ledger locked'
          // <Button
          //   disabled={ledgerLoading || isBusy}
          //   onClick={refresh}
          // >
          //     Refresh
          // </Button>
        )
        : (
          <Button
            disabled={!!error || !!ledgerError || !address || !genesis}
            onClick={_onSave}
          >
            Import Account
          </Button>
        )
      }
    </Box>
  );
}

export default styled(ImportLedger)`
  .refreshIcon {
    margin-right: 0.3rem;
  }
`;
