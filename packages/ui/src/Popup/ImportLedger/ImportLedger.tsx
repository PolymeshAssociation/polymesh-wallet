import { ErrorMessage } from '@hookform/error-message';
import settings from '@polkadot/ui-settings';
import { genesisHash } from '@polymathnetwork/extension-core/constants';
import { SvgLedgerLogo } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Password } from '@polymathnetwork/extension-ui/components';
import { ActionContext, ActivityContext, PolymeshContext } from '@polymathnetwork/extension-ui/components/contexts';
import Dropdown from '@polymathnetwork/extension-ui/components/Dropdown';
import Name from '@polymathnetwork/extension-ui/components/Name';
import { Status, useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { createAccountHardware, validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { formatters } from '@polymathnetwork/extension-ui/util';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { TroubleshootGuide } from './TroubleshootGuide';

interface AccOption {
  text: string;
  value: number;
}

type FormInputs = {
  accountName: string;
  password: string;
}

const AVAIL: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function ImportLedger (): React.ReactElement {
  const genesis = genesisHash;

  const methods = useForm<FormInputs>();
  const { errors, handleSubmit, register } = methods;

  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [addressOffset, setAddressOffset] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const onAction = useContext(ActionContext);
  const [name, setName] = useState<string | null>(null);
  const ledgerData = useLedger(genesis, accountIndex, addressOffset);
  const { address, error: ledgerError, isLoading: ledgerLoading, isLocked: ledgerLocked, refresh, status, warning: ledgerWarning } = ledgerData;
  const isBusy = useContext(ActivityContext);

  const { polymeshAccounts } = useContext(PolymeshContext);
  const oneAddress = useMemo(() => polymeshAccounts && polymeshAccounts.length > 0 && polymeshAccounts[0].address, [polymeshAccounts]);

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
  const _onSetAccountIndex = useCallback((value: string) => setAccountIndex(Number(value)), []);
  const _onSetAddressOffset = useCallback((value: string) => setAddressOffset(Number(value)), []);

  const onContinue = async ({ accountName, password }: FormInputs) => {
    if (!oneAddress) return;

    console.log({ accountName, password });

    const isValidPassword = await validateAccount(oneAddress, password);

    console.log({ oneAddress, isValidPassword });
  };

  return (
    <>
      {false && status !== Status.Ok
        ? <Box p='s'>
          <TroubleshootGuide ledgerStatus={status}
            refresh={refresh}/>
        </Box>
        : <>
          <Header headerText='Connect your ledger'
            iconAsset={SvgLedgerLogo}>
            <Box>
              <Text color='gray.0'
                variant='b2'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </Box>
          </Header>

          <>
            <Box p='8px'>
              <Flex>
                <Flex bg='brandLightest'
                  borderRadius='50%'
                  flex='0 0 40px'
                  height={40}
                  justifyContent='center'>
                  <Text color='brandMain'>
                  ??
                  </Text>
                </Flex>
                <Flex alignItems='flex-start'
                  flexDirection='column'
                  ml='8px'>
                  <Text color='gray.1'
                    variant='b2m'>??? ???</Text>
                  <Text color='gray.2'
                    variant='b3'>
                    {address && formatters.toShortAddress(address, { size: 33 })}
                  </Text>
                </Flex>
              </Flex>

              <FormProvider {...methods}>
                <form
                  id='ledgerImport'
                  onSubmit={handleSubmit(onContinue)}
                >
                  <Box mt='m'>
                    <Box>
                      <Text color='gray.1'
                        variant='b2m' >
                      Account name
                      </Text>
                    </Box>
                    <Box>
                      <TextInput inputRef={register({ required: 'Account name is required' })}
                        name='accountName'
                        placeholder='Enter account name' />
                      <Box>
                        <Text color='alert'
                          variant='b3'>
                          <ErrorMessage errors={errors}
                            name='accountName' />
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  <Password label='Wallet password'
                    placeholder='Enter your current wallet password'
                  />

                  <Button disabled={isBusy}
                    fluid
                    type='submit' >
                    Continue
                  </Button>
                </form>
              </FormProvider>
            </Box>

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
            {(!!error || !!ledgerError) && (
              <div>
                {error || ledgerError}
              </div>
            )}
          </>
          {ledgerLocked
            ? (
              <Button
                disabled={ledgerLoading || isBusy}
                onClick={refresh}
              >
              Refresh
              </Button>
            )
            : (
              <Button
                disabled={!!error || !!ledgerError || !address || !genesis}
                fluid
                onClick={_onSave}
              >
                Continue
              </Button>
            )
          }
        </>
      }
    </>
  );
}

export default styled(ImportLedger)`
  .refreshIcon {
    margin-right: 0.3rem;
  }
`;
