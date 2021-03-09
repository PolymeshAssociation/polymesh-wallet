import SvgConnectLedger from '@polymathnetwork/extension-ui/assets/images/connect-ledger.svg';
import { SvgInfo, SvgLedgerLogo } from '@polymathnetwork/extension-ui/assets/images/icons';
import SvgInstallLedgerApp from '@polymathnetwork/extension-ui/assets/images/install-ledger-app.svg';
import { colors, texts } from '@polymathnetwork/extension-ui/components/themeDefinitions';
import { Status } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { Box, Button, Flex, Heading, Icon, Link, Loading, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  ledgerStatus: Status | null;
  refresh: () => void;
};

export function TroubleshootGuide ({ ledgerStatus, refresh }: Props): React.ReactElement | null {
  const [isLoading, setIsLoading] = useState(true);

  const isDeviceIssue = ledgerStatus === Status.Device || ledgerStatus === Status.Error;
  const isAppIssue = ledgerStatus === Status.App;

  // Show a loading spinner for 1.5s by default, because `ledgerStatus` may become 'Ok' by itself
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [isDeviceIssue, ledgerStatus]);

  return (
    isLoading
      ? <Flex height='578px'
        justifyContent='center'
        width='100%'>
        <Loading />
      </Flex>
      : <Box>
        <Flex bg='yellow.1'
          borderRadius='50%'
          height={48}
          justifyContent='center'
          mb={12}
          width={48}>
          <Icon Asset={SvgInfo}
            color='yellow.0'
            height={20}
            width={20} />
        </Flex>

        <Heading variant='h5'>Your Ledger is not connected</Heading>

        <Box mb='m'>
          <StepList>
            <Step className={isDeviceIssue ? 'active' : ''}>
              <Box my='m'>
                <Box mb='s'>
                  <img src={SvgConnectLedger} />
                </Box>
                <Text variant='b1m'>Please ensure that:</Text>
                <Text color='gray.2'
                  variant='b2'>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>the device is connected</li>
                    <li>the device is unlocked</li>
                    <li>USB permission is granted in the browser</li>
                  </ul>
                </Text>
              </Box>
            </Step>
            <Step className={isAppIssue ? 'active' : ''}>
              <Box my='m'>
                <Box mb='s'>
                  <img src={SvgInstallLedgerApp} />
                </Box>
                <Text variant='b1m'>
                To install and open the Polymesh app:
                </Text>
                <Text color='gray.2'
                  variant='b2'>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>
                      <Link href='https://github.com/Zondax/ledger-polymesh'
                        target='_blank'>
                      install the Polymesh app on the Ledger
                      </Link>
                    </li>
                    <li>open Polymesh app on the Ledger</li>
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
    ${texts.b1m}; 
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
    color: ${colors.brandMain};
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

  :not(.active) {
    opacity: 50%;
  }
`;
