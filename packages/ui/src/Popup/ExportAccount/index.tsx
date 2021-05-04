import { SvgAlertCircle, SvgOpenInNew } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { ActionContext, ActivityContext } from '../../components';
import { exportAccount } from '../../messaging';

interface AddressState {
  address: string;
}

export const ExportAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const { address } = useParams<AddressState>();

  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (!address) {
      return;
    }

    try {
      const { exportedJson } = await exportAccount(address, data.currentPassword);

      const element = document.createElement('a');
      const { meta } = exportedJson;

      element.href = `data:text/plain;charset=utf-8,${JSON.stringify(exportedJson)}`;
      element.download = `${meta.name}_exported_account_${Date.now()}.json`;
      element.click();

      onAction('/');
    } catch (e) {
      setError('currentPassword', { type: 'WrongPassword' });
    }
  };

  return (
    <>
      <Header headerText='Export account'
        iconAsset={SvgOpenInNew}>
      </Header>
      <Flex alignItems='stretch'
        flexDirection='column'
        height='100%'
        p='s'>
        <Box borderColor='gray.4'
          borderRadius={3}
          borderStyle='solid'
          borderWidth={2}
          p='s'>
          <Flex>
            <Icon Asset={SvgAlertCircle}
              color='warning'
              height={20}
              width={20} />
            <Box ml='s'>
              <Text color='warning'
                variant='b3m'>
                Attention
              </Text>
            </Box>
          </Flex>
          <Text color='gray.1'
            variant='b2m'>
            Please remember the password you enter below as you will need it to recover your account. You are exporting your account details as a JSON file. Keep this file safe and secured.
          </Text>
        </Box>
        <form id='passwordForm'
          onSubmit={handleSubmit(onSubmit)}>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
              Wallet password
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='currentPassword'
                placeholder='Enter your wallet password'
                type='password' />
              {errors.currentPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.currentPassword).type === 'required' && 'Required field'}
                  {(errors.currentPassword).type === 'minLength' && 'Password too short'}
                  {(errors.currentPassword).type === 'WrongPassword' && 'Invalid password'}
                </Text>
              </Box>
              }
            </Box>
          </Box>
        </form>
        <Box mt='auto'>
          <Button busy={isBusy}
            fluid
            form='passwordForm'
            type='submit'>
            Export account
          </Button>
        </Box>
      </Flex>
    </>
  );
};
