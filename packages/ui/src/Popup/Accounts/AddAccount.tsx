import { SvgPolyNew } from '@polymathnetwork/extension-ui/assets/images/icons';
// import useIsPopup from '@polymathnetwork/extension-ui/hooks/useIsPopup';
// import { useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
// import { windowOpen } from '@polymathnetwork/extension-ui/messaging';
import React, { useCallback, useContext, useState } from 'react';

import { ActionContext } from '../../components';
import { Box, Button, Checkbox, Flex, Header, Heading, Icon, Link, Text } from '../../ui';

function AddAccount (): React.ReactElement {
  const onAction = useContext(ActionContext);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // const isPopup = useIsPopup();
  // const { isLedgerEnabled } = useLedger();

  // const _onOpenLedgerConnect = useCallback(
  //   () => windowOpen('/account/import-ledger'),
  //   []
  // );
  const onCreateAccount = useCallback((): void => onAction('/account/create'), [onAction]);

  const onImportAccount = useCallback((): void => onAction('/account/restore/seed'), [onAction]);

  // const onConnectLedger = useCallback((): void => {
  //   if (!isLedgerEnabled && isPopup) {
  //     _onOpenLedgerConnect().then(console.log).catch(console.error);
  //   } else {
  //     onAction('/account/import-ledger');
  //   }
  // }, [_onOpenLedgerConnect, isLedgerEnabled, isPopup, onAction]);

  return (
    <>
      <Header>
        <Box height={308}
          pt='m'>
          <Box
            backgroundColor='brandLightest'
            border='solid'
            borderColor='white'
            borderRadius='50%'
            borderWidth={4}
            height={72}
            padding={18}
            width={72}
          >
            <Icon Asset={SvgPolyNew}
              color='brandMain'
              height={30}
              width={30} />
          </Box>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h4'>
              Welcome to the Polymesh Wallet!
            </Heading>
          </Box>
          <Box mt='s'>
            <Text color='brandLightest'
              variant='b2'>
              Manage your Polymesh digital assets by creating an account or using an existing account.
            </Text>
          </Box>
        </Box>
      </Header>
      <Flex alignItems='stretch'
        flex={1}
        flexDirection='column'
        justifyContent='space-between'
        mx='s'>
        <Box id='agreement-checkboxes'
          mt='m'>
          <Flex alignItems='flex-start'
            justifyContent='flex-start'
            mb='xs'>
            <Checkbox checked={policyAccepted}
              onClick={() => setPolicyAccepted(!policyAccepted)} />
            <Flex ml='s'>
              <Text color='gray.3'
                variant='b3'>
                I have read and accept the Polymath{' '}
                <Link href='https://polymath.network/privacy-policy'
                  id='sign-up-privacy-link'>
                  Privacy Policy
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
          <Flex alignItems='flex-start'
            justifyContent='flex-start'
            mb='s'
            mt='xs'>
            <Checkbox checked={termsAccepted}
              onClick={() => setTermsAccepted(!termsAccepted)} />
            <Flex ml='s'>
              <Text color='gray.3'
                variant='b3'>
                I have read and accept the Polymath{' '}
                <Link href='https://polymath.network/polymesh-testnet/wallet-terms'
                  id='sign-up-privacy-link'>
                  Terms of Use
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Box mb='s'>
          <Box mx='xs'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onCreateAccount}>
              Create new account
            </Button>
          </Box>
          <Box mt='s'
            mx='xs'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onImportAccount}
              variant='secondary'>
              Restore account
            </Button>
          </Box>
          {/* <Box mt='s'
            mx='xs'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onConnectLedger}
              variant='secondary'>
              <Box mr='s'>
                <Icon Asset={SvgLedger}
                  height={24}
                  width={24} />
              </Box>
              Connect your Ledger
            </Button>
          </Box> */}
        </Box>
      </Flex>
    </>
  );
}

export default React.memo(AddAccount);
