import type { NetworkName } from '@polymeshassociation/extension-core/types';

import { ErrorMessage } from '@hookform/error-message';
import settings from '@polkadot/ui-settings';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { recodeAddress } from '@polymeshassociation/extension-core/utils';
import { SvgChevronDown, SvgLedgerLogo, SvgSettingsOutline } from '@polymeshassociation/extension-ui/assets/images/icons';
import { AccountContext, ActionContext, ActivityContext, PolymeshContext } from '@polymeshassociation/extension-ui/components/contexts';
import Dropdown from '@polymeshassociation/extension-ui/components/Dropdown';
import { InitialsAvatar } from '@polymeshassociation/extension-ui/components/InitialsAvatar';
import { Status, useLedger } from '@polymeshassociation/extension-ui/hooks/useLedger';
import { createAccountHardware } from '@polymeshassociation/extension-ui/messaging';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymeshassociation/extension-ui/ui';
import { formatters } from '@polymeshassociation/extension-ui/util';

import { TroubleshootGuide } from './TroubleshootGuide';

interface AccOption {
  text: string;
  value: number;
}

interface FormInputs {
  accountName: string;
}

const AVAIL: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
];

const GENESIS_HASHES: Partial<Record<NetworkName, `0x${string}`>> = {
  mainnet: '0x6fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063',
  testnet: '0x2ace05e703aa50b48c0ccccfc8b424f7aab9a1e2c424ed12e45d20b1e8ffd0d6'
};

function ImportLedger (): React.ReactElement {
  const methods = useForm<FormInputs>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, handleSubmit, register } = methods;

  const [accountIndex, setAccountIndex] = useState<number>(0);
  const [addressOffset, setAddressOffset] = useState<number>(0);
  const [, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [isShowingSettings, setIsShowingSettings] = useState(false);

  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const isBusy = useContext(ActivityContext);
  const { networkState } = useContext(PolymeshContext);

  const genesis = GENESIS_HASHES[networkState.selected];

  const ledgerData = useLedger(genesis, accountIndex, addressOffset);

  const { address: ledgerAddress,
    isLoading: ledgerLoading,
    refresh,
    status } = ledgerData;

  const address: string | null = useMemo(() => {
    if (ledgerAddress) {
      settings.set({ ledgerConn: 'webusb' });

      return recodeAddress(ledgerAddress, networkState.ss58Format);
    } else {
      return null;
    }
  }, [ledgerAddress, networkState.ss58Format]);

  // Set accountIndex and addressOffset to next available pair
  useEffect(() => {
    const ledgerAccounts = accounts.filter(
      (account) => account.isHardware && account.hardwareType === 'ledger'
    );
    const existingIndexOffsetMap = ledgerAccounts.reduce(
      (indexOffsetMap: number[][], account) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const index = account.accountIndex!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const offset = account.addressOffset!;

        if (indexOffsetMap[index]) {
          indexOffsetMap[index].push(offset);
        } else {
          indexOffsetMap[index] = [offset];
        }

        return indexOffsetMap;
      },
      []
    );

    for (
      let offset = 0, shouldContinue = true;
      offset < 20 && shouldContinue;
      offset++
    ) {
      for (let index = 0; index < 20 && shouldContinue; index++) {
        const isExistingIndexOffsetPair =
          existingIndexOffsetMap[index]?.includes(offset);

        if (!isExistingIndexOffsetPair) {
          setAccountIndex(index);
          setAddressOffset(offset);

          shouldContinue = false;
        }
      }
    }
  }, [accounts]);

  const accOps = useRef(
    AVAIL.map(
      (value): AccOption => ({
        text: `Account type ${value}`,
        value
      })
    )
  );

  const addOps = useRef(
    AVAIL.map(
      (value): AccOption => ({
        text: `Address index ${value}`,
        value
      })
    )
  );

  const updateAccountIndex = useCallback((value: string) => {
    setAccountIndex(Number(value));
  }, []);

  const updateAddressOffset = useCallback((value: string) => {
    setAddressOffset(Number(value));
  }, []);

  const saveAccount = useCallback(() => {
    if (address && genesis && name) {
      createAccountHardware(
        address,
        'ledger',
        accountIndex,
        addressOffset,
        name,
        genesis
      )
        .then(() => onAction('/'))
        .catch((error: Error) => {
          console.error(error);

          setError(error.message);
        });
    }
  }, [accountIndex, address, addressOffset, genesis, name, onAction]);

  const toggleShowingSettings = useCallback(() => {
    setIsShowingSettings(!isShowingSettings);
  }, [isShowingSettings]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    handleSubmit(saveAccount)(e).catch(console.error);
  }, [handleSubmit, saveAccount]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);

  return (
    <>
      {status !== Status.Ok
        ? (
          <Box
            p='s'
            style={{ overflow: 'auto' }}
          >
            <TroubleshootGuide
              headerText='Your Ledger is not connected'
              ledgerStatus={status}
              refresh={refresh}
            />
          </Box>
        )
        : (
          <>
            <Header
              headerText='Import Ledger account'
              iconAsset={SvgLedgerLogo}
            >
              <Box>
                <Text
                  color='gray.0'
                  variant='b2'
                >
                Please enter a name to import account.
                </Text>
              </Box>
            </Header>
            <>
              <Flex
                alignItems='flex-start'
                flexDirection='column'
                height='100%'
                p='m'
                style={{ overflowY: 'scroll ' }}
              >
                <Flex width='100%'>
                  <Flex
                    bg='brandLightest'
                    borderRadius='50%'
                    flex='0 0 40px'
                    height={40}
                    justifyContent='center'
                  >
                    <InitialsAvatar name={name} />
                  </Flex>
                  <Flex
                    alignItems='flex-start'
                    flexDirection='column'
                    ml='8px'
                  >
                    <Text
                      color='gray.1'
                      variant='b2m'
                    >
                      {name}
                    </Text>
                    <Text
                      color='gray.2'
                      variant='b3'
                    >
                      {address &&
                      formatters.toShortAddress(address, { size: 33 })}
                    </Text>
                  </Flex>
                </Flex>
                <Box width='100%'>
                  <FormProvider {...methods}>
                    <form
                      id='ledgerImport'
                      onSubmit={handleFormSubmit}
                    >
                      <Box mt='m'>
                        <Box>
                          <Text
                            color='gray.1'
                            variant='b2m'
                          >
                          Account name
                          </Text>
                        </Box>
                        <Box>
                          <TextInput
                            inputRef={register({
                              required: 'Account name is required'
                            })}
                            name='accountName'
                            onChange={onChange}
                            placeholder='Enter account name'
                            value={name}
                          />
                          <Box>
                            <Text
                              color='alert'
                              variant='b3'
                            >
                              <ErrorMessage
                                errors={errors}
                                name='accountName'
                              />
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </form>
                  </FormProvider>
                </Box>
                <Box
                  my='l'
                  width='100%'
                >
                  <SettingsButton
                    mb='m'
                    onClick={toggleShowingSettings}
                    width='100%'
                  >
                    <Icon
                      Asset={SvgSettingsOutline}
                      color='brandMain'
                      height='20px'
                      width='20px'
                    />
                    <Box ml='s'>
                      <Text color='brandMain'>Advanced settings</Text>
                    </Box>
                    <Box ml='auto'>
                      <Icon
                        Asset={SvgChevronDown}
                        color='brandMain'
                        height='20px'
                        width='20px'
                      />
                    </Box>
                  </SettingsButton>
                  {isShowingSettings && (
                    <>
                      <Box mb='m'>
                        <Text
                          color='gray.1'
                          variant='b2m'
                        >
                        Account type
                        </Text>
                        <Box mb='3px'>
                          <Dropdown
                            className='accountType'
                            disabled={ledgerLoading}
                            onChange={updateAccountIndex}
                            options={accOps.current}
                            value={accountIndex}
                          />
                        </Box>
                      </Box>
                      <Box mb='m'>
                        <Text
                          color='gray.1'
                          variant='b2m'
                        >
                        Address index
                        </Text>
                        <Box mb='3px'>
                          <Dropdown
                            className='accountIndex'
                            disabled={ledgerLoading}
                            onChange={updateAddressOffset}
                            options={addOps.current}
                            value={addressOffset}
                          />
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
                <Box
                  mt='auto'
                  width='100%'
                >
                  <Button
                    disabled={isBusy}
                    fluid
                    form='ledgerImport'
                    type='submit'
                  >
                  Continue
                  </Button>
                </Box>
              </Flex>
            </>
          </>
        )}
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
