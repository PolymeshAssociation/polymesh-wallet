import React, { useCallback, useContext } from 'react';

import { ActionContext } from '../../components';
import { Header, Icon, Box, Heading, Text, Button } from '../../ui';
import { SvgPolyNew } from '@polymathnetwork/extension-ui/assets/images/icons';

function AddAccount (): React.ReactElement {
  const onAction = useContext(ActionContext);

  const onCreateAccount = useCallback((): void => onAction('/account/create'), [onAction]);

  const onImportSeed = useCallback((): void => onAction('/account/import-seed'), [onAction]);

  const onImportJson = useCallback((): void => onAction('/account/restore-json'), [onAction]);

  return (
    <>
      <Header>
        <Box mt='l'
          pb='5'>
          <Box
            backgroundColor='brandLightest'
            border='solid'
            borderColor='white'
            borderRadius='50%'
            borderWidth={4}
            height={80}
            padding={13}
            width={80}
          >
            <Icon Asset={SvgPolyNew}
              color='brandMain'
              height={50}
              width={50} />
          </Box>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h4'>
              Welcome to the Polymesh Wallet!
            </Heading>
          </Box>
          <Box mb='4'
            mt='s'>
            <Text color='white'
              variant='b2'>
              Manage your Polymesh digital assets by creating an account or signing in to an existing account below.
            </Text>
          </Box>
        </Box>
      </Header>
      <Box mt='m'>
        <Button fluid
          onClick={onCreateAccount}>
          Create account
        </Button>
      </Box>
      <Box mt='s'>
        <Button fluid
          onClick={onImportSeed}
          variant='secondary'>
          Import account from seed
        </Button>
      </Box>
      <Box mt='s'>
        <Button fluid
          onClick={onImportJson}
          variant='ghost'>
          Import account from JSON
        </Button>
      </Box>
    </>
  );
}

export default React.memo(AddAccount);
