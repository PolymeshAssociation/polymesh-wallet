import React, { FC, useContext } from 'react';
import { Controller, FieldError, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Flex, Header, Icon, Link, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import { SvgAccountCardDetailsOutline, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { ActivityContext, Password } from '@polymathnetwork/extension-ui/components';

export interface Props {
  existingAccount?: string;
  onBack: () => void;
  onContinue: () => void;
  setAccountDetails: (name: string, password:string) => void;
}

export const AccountDetails: FC<Props> = ({ existingAccount, onBack, onContinue, setAccountDetails }) => {
  const methods = useForm({
    defaultValues: {
      accountName: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  const { control, errors, getValues, handleSubmit, register, setError } = methods;
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: any; }) => {
    if (existingAccount) {
      const isValidPassword = await validateAccount(existingAccount, data.password);

      if (!isValidPassword) {
        setError('password', {
          type: 'manual',
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

  console.log(getValues('hasAcceptTerms'));

  return (
    <>
      <Header headerText='Create and confirm your account name and wallet password'
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
              {errors?.accountName &&
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
          <Password label={existingAccount !== '' ? 'Wallet password' : 'Password'}
            withConfirm={!existingAccount} />
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
              disabled={(Object.keys(errors).length !== 0) || (!getValues('hasAcceptTerms')) || (!getValues('hasAcceptedPolicy'))}
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
