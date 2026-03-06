import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';

import { POLYMESH_GENERIC_SPEC_VERSION } from '@polymeshassociation/extension-core/constants';
import { SvgLedgerLogo } from '@polymeshassociation/extension-ui/assets/images/icons';
import Dropdown from '@polymeshassociation/extension-ui/components/Dropdown';
import { getStoredLedgerApp, setStoredLedgerApp } from '@polymeshassociation/extension-ui/hooks/useLedger';
import { Box, Button, Flex, Header, Text } from '@polymeshassociation/extension-ui/ui';

const POLYMESH_LEDGER_APP_OPTIONS = [
  { text: 'Polymesh (recommended)', value: 'polymesh' },
  { text: 'Polkadot Generic', value: 'generic' }
];

export function LedgerSettings (): React.ReactElement {
  const history = useHistory();
  const [ledgerApp, setLedgerApp] = useState<string>(getStoredLedgerApp() ?? 'polymesh');

  const updateLedgerApp = useCallback((value: string) => {
    setLedgerApp(value);
  }, []);

  const saveAndGoBack = useCallback(() => {
    setStoredLedgerApp(ledgerApp);
    history.push('/');
  }, [history, ledgerApp]);

  return (
    <Flex
      flexDirection='column'
      height='100%'
    >
      <Header
        headerText='Ledger Settings'
        iconAsset={SvgLedgerLogo}
        width='100%'
      >
        <Box>
          <Text
            color='gray.0'
            variant='b2'
          >
            Configure which Ledger app is used for signing and account import.
          </Text>
        </Box>
      </Header>
      <Flex
        flexDirection='column'
        height='100%'
        p='m'
      >
        <Box mb='m'>
          <Box mb='xs'>
            <Text
              color='gray.1'
              variant='b2m'
            >
              Ledger App
            </Text>
          </Box>
          <Dropdown
            className='ledgerApp'
            onChange={updateLedgerApp}
            options={POLYMESH_LEDGER_APP_OPTIONS}
            value={ledgerApp}
          />
          <Box mt='xs'>
            <Text
              color='gray.2'
              variant='b3'
            >
              {`Note: for networks with a spec version below ${POLYMESH_GENERIC_SPEC_VERSION}, the Legacy app is used automatically regardless of this setting.`}
            </Text>
          </Box>
        </Box>
        <Box mt='auto'>
          <Button
            fluid
            onClick={saveAndGoBack}
            variant='secondary'
          >
            Save
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}

export default LedgerSettings;
