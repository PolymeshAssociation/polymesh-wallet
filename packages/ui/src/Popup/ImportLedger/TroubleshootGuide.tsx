import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import SvgConnectLedger from '@polymeshassociation/extension-ui/assets/images/connect-ledger.svg';
import { SvgAlertCircle, SvgInfo, SvgLedgerLogo } from '@polymeshassociation/extension-ui/assets/images/icons';
import SvgInstallLedgerApp from '@polymeshassociation/extension-ui/assets/images/install-ledger-app.svg';
import SvgPlugInLedger from '@polymeshassociation/extension-ui/assets/images/plug-in-ledger.svg';
import { colors, texts } from '@polymeshassociation/extension-ui/components/themeDefinitions';
import { Status } from '@polymeshassociation/extension-ui/hooks/useLedger';
import { Box, Button, Flex, Heading, Icon, Link, Text } from '@polymeshassociation/extension-ui/ui';

// Single source of truth for error text lives in processLedgerError (useLedger.ts).
// Status.Device is the only case without a formatted error string — it requires a
// native USB / browser message that the device error classifier doesn't cover.
function getDescription (ledgerStatus: Status | null, error?: string | null): string | null {
  if (ledgerStatus === Status.Device) {
    return 'Please ensure your Ledger device is plugged in and unlocked, then try to connect again.';
  }

  return error ?? null;
}

interface Props {
  ledgerStatus: Status | null;
  refresh: () => void;
  error?: string | null;
  rawError?: string | null;
  headerText?: string;
  cancel?: () => void;
}

export function TroubleshootGuide ({ cancel,
  error,
  headerText,
  ledgerStatus,
  rawError,
  refresh }: Props): React.ReactElement | null {
  const [showDetails, setShowDetails] = useState(false);

  const history = useHistory();

  const onCancel = useCallback(() => {
    if (cancel) {
      cancel();
    }

    history.push('/');
  }, [cancel, history]);

  const attemptToConnect = useCallback(() => {
    refresh();
  }, [refresh]);

  const toggleDetails = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  const description = getDescription(ledgerStatus, error);

  return (
    <Box>
      <Flex
        alignItems='flex-start'
        justifyContent='space-between'
      >
        <Flex
          bg='yellow.1'
          borderRadius='50%'
          height={48}
          justifyContent='center'
          mb={12}
          width={48}
        >
          <Icon
            Asset={SvgInfo}
            color='yellow.0'
            height={20}
            width={20}
          />
        </Flex>
        <Box style={{ cursor: 'pointer' }}>
          <Link onClick={onCancel}>
            <Text
              color='brandLighter'
              variant='b1'
            >
            Cancel
            </Text>
          </Link>
        </Box>
      </Flex>
      <Heading variant='h5'>
        {headerText || 'Your Ledger is not connected'}
      </Heading>
      <Flex
        alignItems='flex-start'
        bg='yellow.1'
        borderRadius='8px'
        mb='m'
        mt='s'
        p='s'
      >
        <Icon
          Asset={SvgAlertCircle}
          color='yellow.0'
          height={20}
          minWidth={20}
          mt='2px'
          width={20}
        />
        <Box ml='xs'>
          <Text
            color='gray1'
            variant='b2'
          >
            {description ?? "Please check that you've set up your Ledger correctly and try to connect again."}
          </Text>
          {rawError && (
            <Box mt='xs'>
              <Link onClick={toggleDetails}>
                <Text
                  color='gray.2'
                  variant='b3'
                >
                  {showDetails ? 'Hide technical details' : 'Show technical details'}
                </Text>
              </Link>
              {showDetails && (
                <Box mt='xs'>
                  <Text
                    color='gray.2'
                    style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    variant='b3'
                  >
                    {rawError}
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Flex>
      <Button
        fluid
        onClick={attemptToConnect}
        variant='secondary'
      >
        <Icon
          Asset={SvgLedgerLogo}
          height={24}
          mr='s'
          width={24}
        />
      Connect your ledger
      </Button>
      <Box
        mb={3}
        mt={4}
      >
        <Text
          color='gray.1'
          variant='c2'
        >
        SET UP YOUR LEDGER TO CONNECT
        </Text>
      </Box>
      <Box mb='l'>
        <StepList>
          <StepItem
            description='Connect your Ledger hardware device to your computer.'
            image={SvgPlugInLedger}
            title='Plug-in Ledger'
          />
          <StepItem
            description='Install Polymesh app on your Ledger through the Ledger Live app.'
            image={SvgInstallLedgerApp}
            title='Install Polymesh app'
          />
          <StepItem
            description='Click on the Connect your Ledger button below to connect.'
            image={SvgConnectLedger}
            title='Connect your Ledger to Polymesh wallet'
          />
        </StepList>
      </Box>
      <Button
        fluid
        onClick={attemptToConnect}
        variant='secondary'
      >
        <Icon
          Asset={SvgLedgerLogo}
          height={24}
          mr='s'
          width={24}
        />
      Connect your ledger
      </Button>
    </Box>
  );
}

function StepItem (props: {
  image: string;
  title: string;
  description: string;
}) {
  const { description, image, title } = props;

  return (
    <Step>
      <Box my='m'>
        <Box mb='s'>
          <img src={image} />
        </Box>
        <Text variant='b1m'>{title}</Text>
        <Box mt='4px'>
          <Text
            color='gray3'
            variant='b2'
          >
            {description}
          </Text>
        </Box>
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
