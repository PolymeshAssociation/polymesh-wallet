import React, { FC, useContext, useState } from 'react';
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
  const { clearErrors, errors, getValues, handleSubmit, register, setError } = methods;
  // const formValues: { [x: string]: string; } = watch();
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (existingAccount !== '') {
      // Existing wallet
      const isValidPassword = await validateAccount(existingAccount, data.password);

      if (isValidPassword) {
        // All good
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('password', { type: 'manual', message: 'Invalid password' });
      }
    } else {
      // New wallet
      onContinue({ accountName: data.accountName, password: data.password });
    }
  };
  
  console.log(errors);

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
          {/* <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                {existingAccount !== '' ? 'Wallet password' : 'Password'}
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='password'
                onChange={checkValues}
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.password &&
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {(errors.password as FieldError).type === 'required' && 'Required field'}
                    {(errors.password as FieldError).type === 'minLength' && 'Password should be 8 characters or more'}
                    {(errors.password as FieldError).type === 'manual' && 'Invalid password'}
                  </Text>
                </Box>
              }
            </Box>
          </Box> */}
          {/* {existingAccount === '' &&
            <Box mb='s'
              mt='m'>
              <Box>
                <Text color='gray.1'
                  variant='b2m'>
                  Confirm password
                </Text>
              </Box>
              <Box>
                <TextInput inputRef={register({ required: true, minLength: 8 })}
                  name='confirmPassword'
                  onChange={checkValues}
                  placeholder='Enter 8 characters or more'
                  type='password' />
                {errors.confirmPassword &&
                  <Box>
                    <Text color='alert'
                      variant='b3'>
                      {(errors.confirmPassword as FieldError).type === 'required' && 'Required field'}
                      {(errors.confirmPassword as FieldError).type === 'minLength' && 'Invalid'}
                      {(errors.confirmPassword as FieldError).type === 'manual' && 'Passwords do not match'}
                    </Text>
                  </Box>
                }
              </Box>
            </Box>
          } */}
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
