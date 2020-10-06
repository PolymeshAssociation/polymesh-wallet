import React, { FC, useContext } from 'react';
import { Box, Button, Flex, Header, Heading, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { ActionContext, PolymeshContext } from '../../components';
import { exportAccount } from '../../messaging';
import { SvgAlertCircle, SvgOpenInNew } from '@polymathnetwork/extension-ui/assets/images/icons';
import { FieldError, useForm } from 'react-hook-form';

export const ExportAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const { selectedAccount } = useContext(PolymeshContext);
  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  console.log('TEST');

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (!selectedAccount) {
      return;
    }

    try {
      const { exportedJson } = await exportAccount(selectedAccount, data.currentPassword);

      const element = document.createElement('a');
      const { meta } = JSON.parse(exportedJson) as { meta: { name: string } };

      element.href = `data:text/plain;charset=utf-8,${exportedJson}`;
      element.download = `${meta.name}_exported_account_${Date.now()}.json`;
      element.click();

      onAction('/');
    } catch (e) {
      setError('currentPassword', { type: 'WrongPassword' });
    }
  };

  return (
    <>
      <Header>
        <Box pt='m'>
          <Box
            backgroundColor='brandLightest'
            borderRadius='50%'
            height={48}
            px={14}
            py={9}
            width={48}
          >
            <Icon Asset={SvgOpenInNew}
              color='brandMain'
              height={20}
              width={20} />
          </Box>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h5'>
              Export account
            </Heading>
          </Box>
        </Box>
      </Header>
      <Box pt='m'>
        <Box borderColor='gray.4'
          borderRadius={3}
          borderStyle='solid'
          borderWidth={2}
          m='xs'
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
            You are exporting your account. Keep it safe and don&apos;t share it with anyone.
          </Text>
        </Box>
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
              placeholder='Enter 8 characters or more'
              type='password' />
            {errors.currentPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.currentPassword as FieldError).type === 'required' && 'Required field'}
                  {(errors.currentPassword as FieldError).type === 'minLength' && 'Password too short'}
                  {(errors.currentPassword as FieldError).type === 'WrongPassword' && 'Invalid password'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
      </form>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='xs'>
        <Button
          fluid
          form='passwordForm'
          type='submit'>
          Export account
        </Button>
      </Flex>
    </>
  );
};
