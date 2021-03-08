import SvgConnectLedger from '@polymathnetwork/extension-ui/assets/images/connect-ledger.svg';
import { SvgInfo, SvgLedgerLogo } from '@polymathnetwork/extension-ui/assets/images/icons';
import SvgInstallLedgerApp from '@polymathnetwork/extension-ui/assets/images/install-ledger-app.svg';
import { colors, texts } from '@polymathnetwork/extension-ui/components/themeDefinitions';
import { Box, Button, Flex, Heading, Icon, Link, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback } from 'react';
import styled from 'styled-components';

type Props = {
  ledgerError: string;
  refresh: () => void;
};

export function TroubleshootGuide ({ ledgerError, refresh }: Props): React.ReactElement | null {
  const renderInstructions = useCallback(() => {
    const isNoDeviceSelected = /no.*selected/gi.test(ledgerError);
    const hasRequestDeviceFailed = /failed.*requestDevice/gi.test(ledgerError);
    const isAppClosed = /not.*open/gi.test(ledgerError);

    switch (true) {
      case isNoDeviceSelected || hasRequestDeviceFailed:
        return (
          <>
            <Heading variant='h5'>Your Ledger is not connected</Heading>
            <Box my='m'>
              <Box mb='s'
                textAlign='center'>
                <img src={SvgConnectLedger} />
              </Box>
              <Text variant='b1m'>Please ensure that:</Text>
              <Text color='gray.2'
                variant='b2'>
                <ul style={{ margin: 0 }}>
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
              <Box mb='s'
                textAlign='center'>
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
  }, [ledgerError]);

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

      <Heading variant='h5'>Your Ledger is not connected</Heading>

      <Box mb='m'>
        {/* {renderInstructions()} */}
        <StepList>
          <Step>
            <Box my='m'>
              <Box mb='s'>
                <img src={SvgConnectLedger} />
              </Box>
              <Text variant='b1m'>Please ensure that:</Text>
              <Text color='gray.2'
                variant='b2'>
                <ul style={{ margin: 0 }}>
                  <li>the device is connected</li>
                  <li>the device is unlocked</li>
                  <li>USB permission is granted in the browser</li>
                </ul>
              </Text>
            </Box>
          </Step>
          <Step>
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
          </Step>
        </StepList>
      </Box>
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
  );
}

const StepList = styled.ol`
  counter-reset: step;
  list-style: none;
  margin: 0;
  padding-left: 8px;
`;

const Step = styled.li`
  counter-increment: step;
  position: relative;
  padding-left: 48px;

  ::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.brandLightest};
    width: 32px;
    height: 32px;
    border-radius: 50%;
    ${texts.b1m}; 
  }

  :not(:last-child)::after {
    content: '';
    position: absolute;
    left: 16px;
    top: calc(32px + 16px + 8px);
    width: 2px;
    height: calc(100% - 32px);
    background: ${colors.brandLightest};
  }
`;
