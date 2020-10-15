import React, { FC, useContext, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Flex, Header, Icon, Link, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgAccountCardDetailsOutline, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { ActivityContext } from '@polymathnetwork/extension-ui/components';

export interface Props {
  existingAccount?: string;
  onBack: () => void;
  onContinue: () => void;
  setAccountDetails: (name: string, password:string) => void;
}

export const AccountDetails: FC<Props> = ({ existingAccount, onBack, onContinue, setAccountDetails }) => {
  const [isValidForm, setValidForm] = useState(false);
  const { control, errors, handleSubmit, register, setError, watch } = useForm();
  const formValues: { [x: string]: any; } = watch();
  const isBusy = useContext(ActivityContext);

  useEffect(() => {
    setValidForm(formValues.hasAcceptTerms && formValues.hasAcceptedPolicy);
  }, [formValues, setValidForm]);

  const onSubmit = async (data: { [x: string]: any; }) => {
    if (existingAccount) {
      const isValidPassword = await validateAccount(existingAccount, data.password);

      if (!isValidPassword) {
        setError('password', {
          type: 'invalidPassword',
          message: 'Password is incorrect'
        });

        return;
      }
    } else {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });

        return;
      }
    }

    setAccountDetails(data.accountName, data.password);
    onContinue();
  };

  return (
    <>
      <Header headerText='Create and confirm your account name and wallet password'
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
            <TextInput inputRef={register({ required: true, minLength: 4 })}
              name='accountName'
              placeholder='Enter 4 characters or more' />
            {errors.accountName &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  {(errors.accountName as FieldError).type === 'required' && 'Required field'}
                  {(errors.accountName as FieldError).type === 'minLength' && 'Invalid'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {existingAccount ? 'Wallet password' : 'Password'}
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
                  {(errors.password as FieldError).type === 'minLength' && 'Password should be at least 8 characters'}
                  {(errors.password as FieldError).type === 'invalidPassword' && 'Invalid password'}
                </Text>
              </Box>
            }
          </Box>
        </Box>
        {!existingAccount &&
          <Box
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
        <Box mt='s'>
          <Controller
            as={<Checkbox />}
            control={control}
            defaultValue={false}
            label={
              <Text color='gray.3'
                variant='b3'>
                I have read and accept the Polymath{' '}
                <Link href='#'
                  id='sign-up-privacy-link'>
                  Privacy Policy
                </Link>
                .
              </Text>
            }
            name='hasAcceptedPolicy'
          />
          <Controller
            as={<Checkbox />}
            control={control}
            defaultValue={false}
            label={
              <Text color='gray.3'
                variant='b3'>
                I have read and accept the Polymath{' '}
                <Link href='#'
                  id='sign-up-privacy-link'>
                  Terms of Service
                </Link>
                .
              </Text>
            }
            name='hasAcceptTerms'
          />
        </Box>
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
              Create account
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
