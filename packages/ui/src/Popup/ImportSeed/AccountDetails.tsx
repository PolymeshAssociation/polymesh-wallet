import React, { FC, useContext, useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgAccountCardDetailsOutline, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { ActivityContext } from '@polymathnetwork/extension-ui/components';

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
  const { errors, handleSubmit, register, setError, watch } = useForm({
    defaultValues: {
      accountName: '',
      password: '',
      confirmPassword: ''
    }
  });
  const [isValidForm, setValidForm] = useState(false);
  const formValues: { [x: string]: string; } = watch();
  const isBusy = useContext(ActivityContext);

  useEffect(() => {
    if (existingAccount !== '') {
      setValidForm(formValues.accountName.length >= 4 && formValues.password.length >= 8);
    } else {
      setValidForm(formValues.accountName.length >= 4 && formValues.password.length >= 8 && formValues.password === formValues.confirmPassword);
    }
  }, [formValues, setValidForm, existingAccount]);

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

  return (
    <>
      <Header headerText='Restore your account with your recovery phrase'
        iconAsset={SvgAccountCardDetailsOutline}>
      </Header>
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
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {existingAccount !== '' ? 'Wallet password' : 'Password'}
            </Text>
          </Box>
          <Box>
            <TextInput inputRef={register({ required: true, minLength: 8 })}
              name='password'
              placeholder='Enter 8 characters or more'
              type='password' />
            {errors.password &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.password as FieldError).type === 'required' && 'Required field'}
                  {(errors.password as FieldError).type === 'minLength' && 'Invalid'}
                  {(errors.password as FieldError).type === 'manual' && 'Invalid password'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
        {existingAccount === '' &&
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
        }
      </form>

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
              disabled={!isValidForm}
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
