import { ErrorMessage } from '@hookform/error-message';
import settings from '@polkadot/ui-settings';
import { genesisHash } from '@polymathnetwork/extension-core/constants';
import { SvgChevronDown, SvgLedgerLogo, SvgSettingsOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Password } from '@polymathnetwork/extension-ui/components';
import { ActionContext, ActivityContext, PolymeshContext } from '@polymathnetwork/extension-ui/components/contexts';
import Dropdown from '@polymathnetwork/extension-ui/components/Dropdown';
import { Status, useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { createAccountHardware, validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { formatters } from '@polymathnetwork/extension-ui/util';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  // @TODO hard-coding the latest test chain genesisHash. Currently Alcyone's.
  const genesis = genesisHash;

  const methods = useForm<FormInputs>();
  const { errors, handleSubmit, register, setError: setFormError } = methods;

  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [addressOffset, setAddressOffset] = useState<number>(0);
  const [, setError] = useState<string | null>(null);
  const onAction = useContext(ActionContext);
  const [name, setName] = useState<string>('');
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  const ledgerData = useLedger(genesis, accountIndex, addressOffset);
  const { address, isLoading: ledgerLoading, refresh, status } = ledgerData;
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

  const updateAccountIndex = (value: string) => {
    setAccountIndex(Number(value));
  };

  const updateAddressOffset = (value: string) => {
    setAddressOffset(Number(value));
  };

  const saveAccount =
    () => {
      if (address && genesis && name) {
        createAccountHardware(address, 'ledger', accountIndex, addressOffset, name, genesis)
          .then(() => onAction('/'))
          .catch((error: Error) => {
            console.error(error);

            setError(error.message);
          });
      }
    };

  const onContinue = async ({ password }: FormInputs) => {
    if (!oneAddress) return;

    const isValidPassword = await validateAccount(oneAddress, password);

    if (isValidPassword) {
      saveAccount();
    } else {
      setFormError('password', { type: 'manual', message: 'Invalid password' });
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '';

    const [name1, name2] = fullName.split(' ');

    return `${name1[0]}${name2 ? name2[0] : ''}`.toUpperCase();
  };

  const toggleShowingSettings = () => {
    setIsShowingSettings(!isShowingSettings);
  };

  return (
    <>
      {status !== Status.Ok
        ? <Box p='s'>
          <TroubleshootGuide
            headerText='Please follow the instructions in order to import Ledger account'
            ledgerStatus={status}
            refresh={refresh}/>
        </Box>
        : <>
          <Header headerText='Import Ledger account'
            iconAsset={SvgLedgerLogo}>
            <Box>
              <Text color='gray.0'
                variant='b2'>
                Please enter a new account name and your existing wallet password in order to import account.
              </Text>
            </Box>
          </Header>

          <>
            <Flex alignItems='flex-start'
              flexDirection='column'
              height='100%'
              p='8px'
              style={{ overflowY: 'scroll ' }}>
              <Flex width='100%'>
                <Flex bg='brandLightest'
                  borderRadius='50%'
                  flex='0 0 40px'
                  height={40}
                  justifyContent='center'>
                  <Text color='brandMain'
                    fontSize={1}>
                    {getInitials(name)}
                  </Text>
                </Flex>
                <Flex alignItems='flex-start'
                  flexDirection='column'
                  ml='8px'>
                  <Text color='gray.1'
                    variant='b2m'>{name}</Text>
                  <Text color='gray.2'
                    variant='b3'>
                    {address && formatters.toShortAddress(address, { size: 33 })}
                  </Text>
                </Flex>
              </Flex>

              <Box width='100%'>
                <FormProvider {...methods}>
                  <form id='ledgerImport'
                    onSubmit={handleSubmit(onContinue)}>
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
                          onChange={(e) => setName(e.target.value)}
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

                    <Password label={oneAddress ? 'Wallet password' : 'Password'}
                      placeholder='Enter your current wallet password'
                      withConfirm={!oneAddress}/>
                  </form>
                </FormProvider>
              </Box>

              <Box my='l'
                width='100%'>
                <SettingsButton mb='m'
                  onClick={toggleShowingSettings}
                  width='100%'>
                  <Icon Asset={SvgSettingsOutline}
                    color='brandMain'
                    height='20px'
                    width='20px' />
                  <Box ml='s'>
                    <Text color='brandMain'>
                      Advanced settings
                    </Text>
                  </Box>
                  <Box ml='auto'>
                    <Icon Asset={SvgChevronDown}
                      color='brandMain'
                      height='20px'
                      width='20px' />
                  </Box>
                </SettingsButton>

                {isShowingSettings &&
                <>
                  <Box mb='m'>
                    <Text color='gray.1'
                      variant='b2m' >
                    Account type
                    </Text>
                    <Dropdown
                      className='accountType'
                      disabled={ledgerLoading}
                      onChange={updateAccountIndex}
                      options={accOps.current}
                      value={accountIndex}
                    />
                  </Box>
                  <Box mb='m'>
                    <Text color='gray.1'
                      variant='b2m' >
                      Account index
                    </Text>
                    <Dropdown
                      className='accountIndex'
                      disabled={ledgerLoading}
                      onChange={updateAddressOffset}
                      options={addOps.current}
                      value={addressOffset}
                    />
                  </Box>
                </>
                }
              </Box>

              <Box mt='auto'
                width='100%'>
                <Button disabled={isBusy}
                  fluid
                  form='ledgerImport'
                  type='submit'>
                  Continue
                </Button>
              </Box>
            </Flex>
          </>
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

const SettingsButton = styled(Flex)`
  :hover {
    cursor: pointer;
  }
`;
