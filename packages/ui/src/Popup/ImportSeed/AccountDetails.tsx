import React, { FC, useContext } from 'react';
import { FieldError, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgAccountCardDetailsOutline, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { ActivityContext, Password } from '@polymathnetwork/extension-ui/components';

export interface AccountInfo {
  accountName: string;
  password: string;
}

export interface Props {
  existingAccount: string;
  onBack: () => void;
  onContinue: (accountInfo: AccountInfo) => void;
}

export const AccountDetails: FC<Props> = ({ existingAccount, onBack, onContinue }) => {
  const methods = useForm({
    defaultValues: {
      accountName: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  const { errors, handleSubmit, register, setError } = methods;
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (existingAccount !== '') {
      const isValidPassword = await validateAccount(existingAccount, data.password);

      if (isValidPassword) {
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('password', { type: 'manual', message: 'Invalid password' });
      }
    } else {
      onContinue({ accountName: data.accountName, password: data.password });
    }
  };

  return (
    <>
      <Header headerText='Restore your account with your recovery phrase'
        iconAsset={SvgAccountCardDetailsOutline}>
      </Header>
      <FormProvider {...methods} >
        <form id='accountForm'
          onSubmit={handleSubmit(onSubmit)}>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                Account name
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true })}
                name='accountName'
                placeholder='Enter account name' />
              {errors.accountName &&
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {(errors.accountName as FieldError).type === 'required' && 'Required field'}
                  </Text>
                </Box>
              }
            </Box>
          </Box>
          <Password label={existingAccount !== '' ? 'Wallet password' : 'Password'}
            withConfirm={!existingAccount} />
        </form>
      </FormProvider>

      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mx='xs'>
        <Flex mb='s'>
          <Button minsize
            onClick={onBack}
            variant='secondary'>
            <Icon Asset={SvgArrowLeft}
              color='gray.1'
              height={16}
              width={16} />
          </Button>
          <Box ml='s'
            width={255}>
            <Button busy={isBusy}
              disabled={Object.keys(errors).length !== 0}
              fluid
              form='accountForm'
              type='submit'>
              Restore
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
