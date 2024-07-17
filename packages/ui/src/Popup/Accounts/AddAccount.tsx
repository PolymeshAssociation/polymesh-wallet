import type { AllowedPath } from '@polymeshassociation/extension-core/background/types';

import React, { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router';

import { SvgLedger } from '@polymeshassociation/extension-ui/assets/images/icons';
import SvgWalletLogo from '@polymeshassociation/extension-ui/assets/images/SvgWalletLogo';
import useIsPopup from '@polymeshassociation/extension-ui/hooks/useIsPopup';
import { useLedger } from '@polymeshassociation/extension-ui/hooks/useLedger';
import { windowOpen } from '@polymeshassociation/extension-ui/messaging';

import { ActionContext } from '../../components';
import { Box, Button, Checkbox, Flex, Header, Heading, Icon, Link, Text } from '../../ui';

function AddAccount (): React.ReactElement {
  const onAction = useContext(ActionContext);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isPopup = useIsPopup();
  const { isLedgerEnabled } = useLedger();
  const history = useHistory();

  const _openWindow = useCallback((path: AllowedPath) => windowOpen(path), []);

  const onCreateOrImportAccount = useCallback(
    (path: AllowedPath) => {
      isPopup ? _openWindow(path).catch((err) => console.error('Error opening window: ', err)) : history.push(path);
    },
    [isPopup, _openWindow, history]
  );

  const onCreateAccount = useCallback(
    () => onCreateOrImportAccount('/account/create'),
    [onCreateOrImportAccount]
  );
  const onImportAccount = useCallback(
    () => onCreateOrImportAccount('/account/restore/seed'),
    [onCreateOrImportAccount]
  );

  const onConnectLedger = useCallback((): void => {
    if (!isLedgerEnabled && isPopup) {
      _openWindow('/account/import-ledger')
        .then(console.log)
        .catch(console.error);
    } else {
      onAction('/account/import-ledger');
    }
  }, [_openWindow, isLedgerEnabled, isPopup, onAction]);

  const handleClickPolicy = useCallback(() => setPolicyAccepted(!policyAccepted), [policyAccepted]);
  const handleClickTerms = useCallback(() => setTermsAccepted(!termsAccepted), [termsAccepted]);

  return (
    <>
      <Header>
        <Box pt='m'>
          <Icon
            Asset={SvgWalletLogo}
            height={80}
            width={80}
          />
          <Box
            pt='m'
            width={220}
          >
            <Heading
              color='white'
              variant='h4'
            >
              Welcome to the Polymesh Wallet!
            </Heading>
          </Box>
          <Box mt='s'>
            <Text
              color='white'
              variant='b2'
            >
              Manage your Polymesh digital assets by creating an account or
              using an existing account.
            </Text>
          </Box>
        </Box>
      </Header>
      <Flex
        alignItems='stretch'
        flex={1}
        flexDirection='column'
        justifyContent='space-between'
        px='m'
      >
        <Box
          id='agreement-checkboxes'
          mt='m'
        >
          <Flex
            alignItems='flex-start'
            justifyContent='flex-start'
            mb='xs'
          >
            <Checkbox
              checked={policyAccepted}
              onClick={handleClickPolicy}
            />
            <Flex ml='s'>
              <Text
                color='gray.3'
                variant='b3'
              >
                I have read and accept the Polymesh Association{' '}
                <Link
                  href='https://polymesh.network/privacy-policy'
                  id='sign-up-privacy-link'
                >
                  Privacy Policy
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
          <Flex
            alignItems='flex-start'
            justifyContent='flex-start'
            mb='s'
            mt='xs'
          >
            <Checkbox
              checked={termsAccepted}
              onClick={handleClickTerms}
            />
            <Flex ml='s'>
              <Text
                color='gray.3'
                variant='b3'
              >
                I have read and accept the Polymesh Association{' '}
                <Link
                  href='https://polymesh.network/terms-of-service'
                  id='sign-up-privacy-link'
                >
                  Terms of Use
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Box mb='s'>
          <Box mx='xs'>
            <Button
              disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onCreateAccount}
            >
              Create new account
            </Button>
          </Box>
          <Box
            mt='s'
            mx='xs'
          >
            <Button
              disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onImportAccount}
              variant='secondary'
            >
              Restore account
            </Button>
          </Box>
          <Box
            mt='s'
            mx='xs'
          >
            <Button
              disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onConnectLedger}
              variant='secondary'
            >
              <Box mr='s'>
                <Icon
                  Asset={SvgLedger}
                  height={24}
                  width={24}
                />
              </Box>
              Connect your Ledger
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default React.memo(AddAccount);
