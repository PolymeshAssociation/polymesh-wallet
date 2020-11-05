import React, { useCallback, useContext, useState } from 'react';

import { ActionContext } from '../../components';
import { Flex, Header, Icon, Box, Heading, Text, Button, Checkbox } from '../../ui';
import { SvgPolyNew } from '@polymathnetwork/extension-ui/assets/images/icons';

function AddAccount (): React.ReactElement {
  const onAction = useContext(ActionContext);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onCreateAccount = useCallback((): void => onAction('/account/create'), [onAction]);

  const onImportSeed = useCallback((): void => onAction('/account/import-seed'), [onAction]);

  const onImportJson = useCallback((): void => onAction('/account/restore-json'), [onAction]);

  return (
    <>
      <Header>
        <Box pb='s'
          pt='m'>
          <Box
            backgroundColor='brandLightest'
            border='solid'
            borderColor='white'
            borderRadius='50%'
            borderWidth={4}
            height={80}
            padding={23}
            width={80}
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
          <Box
            mt='s'>
            <Text color='brandLightest'
              variant='b2'>
              Manage your Polymesh digital assets by creating an account or using an existing account.
            </Text>
          </Box>
        </Box>
      </Header>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='space-between'
        mb='m'>
        <Box mt='m'>
          <Flex alignItems='flex-start'
            justifyContent='flex-start'
            mb='xs'>
            <Checkbox
              checked={policyAccepted}
              onClick={() => setPolicyAccepted(!policyAccepted)}
            />
            <Flex ml='s'>
              <Text color='gray.3'
                variant='b3'>
                I have read and accept the Polymath Privacy Policy.
              </Text>
            </Flex>
          </Flex>
          <Flex alignItems='flex-start'
            justifyContent='flex-start'
            mb='s'>
            <Checkbox
              checked={termsAccepted}
              onClick={() => setTermsAccepted(!termsAccepted)}
            />
            <Flex ml='s'>
              <Text color='gray.3'
                variant='b3'>
                I have read and agree to the Polymath Terms of Service.
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Box mt='m'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onCreateAccount}>
              Create new account
            </Button>
          </Box>
          <Box mt='s'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onImportSeed}
              variant='secondary'>
              Restore account with recovery phrase
            </Button>
          </Box>
          <Box mt='s'>
            <Button disabled={!(policyAccepted && termsAccepted)}
              fluid
              onClick={onImportJson}
              variant='secondary'>
              Import account with JSON file
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default React.memo(AddAccount);
