import { SvgAlertCircle, SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Button, Flex, Header, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useParams } from 'react-router';

import { ActionContext, ActivityContext } from '../../components';
import { forgetAccount } from '../../messaging';

interface ParamTypes {
  address: string
}

export const ForgetAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const { address } = useParams<ParamTypes>();
  const isBusy = useContext(ActivityContext);
  const handleError = useErrorHandler();

  const onExport = async () => {
    try {
      await forgetAccount(address);

      onAction('/');
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <>
      <Header headerText='Forget account'
        iconAsset={SvgFileLockOutline}>
      </Header>
      <Flex flexDirection='column'
        height='100%'
        p='s'>
        <Box pt='s'>
          <Box borderColor='gray.4'
            borderRadius={3}
            borderStyle='solid'
            borderWidth={2}
            p='s'>
            <Flex>
              <Icon Asset={SvgAlertCircle}
                color='alert'
                height={20}
                width={20} />
              <Box ml='s'>
                <Text color='alert'
                  variant='b3m'>
                Attention
                </Text>
              </Box>
            </Flex>
            <Text color='gray.1'
              variant='b2m'>
            You are about to remove this account. Once removed, this account will not be accessible via this extension unless you re-add it via JSON file or seed phrase.
            </Text>
          </Box>
        </Box>
        <Box mt='auto'
          width='100%'>
          <Button busy={isBusy}
            fluid
            onClick={onExport}>
          Forget account
          </Button>
        </Box>
      </Flex>
    </>
  );
};
