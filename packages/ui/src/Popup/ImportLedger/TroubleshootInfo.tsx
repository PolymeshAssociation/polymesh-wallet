import SvgConnectLedger from '@polymathnetwork/extension-ui/assets/images/connect-ledger.svg';
import { SvgInfo, SvgLedgerLogo } from '@polymathnetwork/extension-ui/assets/images/icons';
import SvgInstallLedgerApp from '@polymathnetwork/extension-ui/assets/images/install-ledger-app.svg';
import { Box, Button, Flex, Heading, Icon, Link, Text } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

type Props = {
  error?: string | null;
  refresh: () => void;
};

export function TroubleshootInfo ({ error, refresh }: Props): React.ReactElement | null {
  if (!error) return null;

  console.log({ error });

  const renderInstructions = () => {
    const isNoDeviceSelected = /no.*selected/gi.test(error);
    const hasRequestDeviceFailed = /failed.*requestDevice/gi.test(error);
    const isAppClosed = /not.*open/gi.test(error);

    console.log({ isNoDeviceSelected, isAppClosed, hasRequestDeviceFailed });

    switch (true) {
      case isNoDeviceSelected || hasRequestDeviceFailed:
        return (
          <>
            <Heading variant='h5'>Your Ledger is not connected</Heading>
            <Box my='m'>
              <Box mb='s'>
                <img src={SvgConnectLedger} />
              </Box>
              <Text variant='b1m'>Please ensure that:</Text>
              <Text color='gray.2'
                variant='b2'>
                <ul>
                  <li>the device is connected</li>
                  <li>the device is unlocked</li>
                  <li>USB permission is granted in the browser</li>
                </ul>
              </Text>
            </Box>
          </>
        );
      case isAppClosed:
        return (
          <>
            <Heading variant='h5'>Polymesh app is not open</Heading>
            <Box my='m'>
              <Box mb='s'>
                <img src={SvgInstallLedgerApp} />
              </Box>
              <Text variant='b1m'>
                To install and open the Polymesh app:
              </Text>
              <Text color='gray.2'
                variant='b2'>
                <ul>
                  <li>
                    <Link href='https://github.com/Zondax/ledger-polymesh'
                      target='_blank'>
                      install the Polymesh app on the Ledger
                    </Link>
                  </li>
                  <li>open Polymesh app on the Ledger</li>
                  <li>confirm &quot;Polymesh Ready&quot; message</li>
                </ul>
              </Text>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Flex bg='yellow.1'
        borderRadius='50%'
        height={48}
        justifyContent='center'
        mb={16}
        width={48}>
        <Icon Asset={SvgInfo}
          color='yellow.0'
          height={20}
          width={20} />
      </Flex>
      {renderInstructions()}
      <Box my={16}>
        <Button fluid
          onClick={refresh}
          variant='secondary'>
          <Icon Asset={SvgLedgerLogo}
            height={24}
            mr='s'
            width={24}/>
          Refresh
        </Button>
      </Box>
    </Box>
  );
}
