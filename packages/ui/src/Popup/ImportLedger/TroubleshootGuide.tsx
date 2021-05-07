import SvgConnectLedger from '@polymathnetwork/extension-ui/assets/images/connect-ledger.svg';
import { SvgAlertCircle, SvgInfo, SvgLedgerLogo } from '@polymathnetwork/extension-ui/assets/images/icons';
import SvgInstallLedgerApp from '@polymathnetwork/extension-ui/assets/images/install-ledger-app.svg';
import SvgPlugInLedger from '@polymathnetwork/extension-ui/assets/images/plug-in-ledger.svg';
import { colors, texts } from '@polymathnetwork/extension-ui/components/themeDefinitions';
import { Status } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { Box, Button, Flex, Heading, Icon, Link, Loading, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const toastId = 'ledger-connection-failed';

type Props = {
  ledgerStatus: Status | null;
  refresh: () => void;
  headerText?: string;
  cancel?: () => void;
};

export function TroubleshootGuide ({ cancel, headerText, ledgerStatus, refresh }: Props): React.ReactElement | null {
  const [hasAttempted, setHasAttempted] = useState(false);

  const isDeviceIssue = ledgerStatus === Status.Device || ledgerStatus === Status.Error;
  const isAppIssue = ledgerStatus === Status.App;
  const isLoading = ledgerStatus === Status.Loading;
  const hasConnectionIssue = isDeviceIssue || isAppIssue;

  const history = useHistory();

  const onCancel = () => {
    if (cancel) {
      cancel();
    }

    history.push('/');
  };

  const attemptToConnect = useCallback(() => {
    setHasAttempted(true);
    refresh();
  }, [refresh]);

  // Show connection error toast after clicking "Connect your Ledger" at least once
  useEffect(() => {
    if (hasAttempted && hasConnectionIssue && !toast.isActive(toastId)) {
      toast.error(
        <Flex alignItems='flex-start'
          flexDirection='column'>
          <Flex>
            <Icon Asset={SvgAlertCircle}
              color='yellow.0'
              height={20}
              width={20} />
            <Box ml='s'>
              <Text color='white'
                variant='b1m'>
                Ledger cannot connect
              </Text>
            </Box>
          </Flex>
          <Box mt='4px'>
            <Text color='gray.4'
              variant='b3'>
              There was an error in setting up your Ledger to connect. Please ensure that you have plugged in your
              ledger and installed the Polymesh app on the Ledger.
            </Text>
          </Box>
          <ToastConnectButton onClick={attemptToConnect}>Connect</ToastConnectButton>
        </Flex>,
        {
          toastId,
          closeOnClick: false,
          hideProgressBar: true
        }
      );
    }
  }, [attemptToConnect, hasAttempted, hasConnectionIssue]);

  // Remove toast once connection is successful
  useEffect(() => {
    return () => {
      toast.dismiss(toastId);
    };
  }, []);

  return isLoading
    ? (
      <Flex height='578px'
        justifyContent='center'
        width='100%'>
        <Loading />
      </Flex>
    )
    : (
      <Box>
        <Flex alignItems='flex-start'
          justifyContent='space-between'>
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
          <Box style={{ cursor: 'pointer' }}>
            <Link onClick={onCancel}>
              <Text color='brandLighter'
                variant='b1'>
                Cancel
              </Text>
            </Link>
          </Box>
        </Flex>

        <Heading variant='h5'>{headerText || 'Your Ledger is not connected'}</Heading>
        <Box mb='m'
          mt='4px'>
          <Text color='gray.2'
            variant='b2'>
            Please check that you’ve set up your Ledger correctly and try to connect again.
          </Text>
        </Box>

        <Button fluid
          onClick={attemptToConnect}
          variant='secondary'>
          <Icon Asset={SvgLedgerLogo}
            height={24}
            mr='s'
            width={24} />
          Connect your ledger
        </Button>

        <Box mb={3}
          mt={4}>
          <Text color='gray.1'
            variant='c2'>
            SET UP YOUR LEDGER TO CONNECT
          </Text>
        </Box>

        <Box mb='l'>
          <StepList>
            <StepItem
              description='Connect your Ledger Wallet to your computer.'
              image={SvgPlugInLedger}
              title='Plug-in Ledger'
            />
            <StepItem
              description='Install the Polymesh app on your Ledger through the Ledger app.'
              image={SvgInstallLedgerApp}
              title='Install Polymesh app'
            />
            <StepItem
              description='Click on the Connect your Ledger button below to connect.'
              image={SvgConnectLedger}
              title='Connect your Ledger to wallet'
            />
          </StepList>
        </Box>
        <Button fluid
          onClick={attemptToConnect}
          variant='secondary'>
          <Icon Asset={SvgLedgerLogo}
            height={24}
            mr='s'
            width={24} />
          Connect your ledger
        </Button>
      </Box>
    );
}

function StepItem (props: { image: string; title: string; description: string }) {
  const { description, image, title } = props;

  return (
    <Step>
      <Box my='m'>
        <Box mb='s'>
          <img src={image} />
        </Box>
        <Text variant='b1m'>{title}</Text>
        <Text color='gray.2'
          variant='b2'>
          <Box mt='4px'>
            <Text color='gray.2'
              variant='b2'>
              {description}
            </Text>
          </Box>
        </Text>
      </Box>
    </Step>
  );
}

const StepList = styled.ol`
  counter-reset: step;
  list-style: none;
  margin: 0;
  padding-left: 0;
`;

const Step = styled.li`
  counter-increment: step;
  position: relative;
  padding-left: 48px;

  :not(:last-child) {
    margin-bottom: 48px;
  }

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
    bottom: calc(-32px - 16px - 8px);
    width: 2px;
    background: ${colors.brandLightest};
  }
`;

const ToastConnectButton = styled.button`
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  background: transparent;
  width: 85px;
  height: 32px;
  margin-left: auto;
`;
