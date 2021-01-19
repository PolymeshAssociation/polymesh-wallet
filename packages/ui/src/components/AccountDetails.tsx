import { SvgAccountCardDetailsOutline, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { ActivityContext, Password } from '@polymathnetwork/extension-ui/components';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PolymeshContext } from './contexts';

export interface AccountInfo {
  accountName: string;
  password: string;
}

export interface Props {
  submitText: string;
  headerText: string;
  onBack: () => void;
  onContinue: (accountInfo: AccountInfo) => void;
  defaultName?: string;
}

type FormInputs = {
  accountName: string,
  password: string,
  confirmPassword: string
};

export const AccountDetails: FC<Props> = ({ defaultName, headerText, onBack, onContinue, submitText }) => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      accountName: defaultName || '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  const { errors, formState, getValues, handleSubmit, register, setError } = methods;
  const isBusy = useContext(ActivityContext);
  const { polymeshAccounts } = useContext(PolymeshContext);
  // Get at least one address amongst user addresses. We will read that address
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oneAddress = useMemo(() => polymeshAccounts && polymeshAccounts.length > 0 && polymeshAccounts[0].address, []);

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (oneAddress) {
      const isValidPassword = await validateAccount(oneAddress, data.password);

      if (isValidPassword) {
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('password', { type: 'manual', message: 'Invalid password' });
      }
    } else {
      if (data.password === data.confirmPassword) {
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      }
    }
  };

  const submitIsDisabled = !formState.isValid ||
    Object.keys(errors).length > 0 ||
    Object.values(getValues()).filter((val) => val === '').length > 0 ||
    formState.isSubmitting;

  return (
    <>
      <Header headerText={headerText}
        iconAsset={SvgAccountCardDetailsOutline}>
      </Header>
      <Box mx='s'>
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
                      {(errors.accountName).type === 'required' && 'Required field'}
                    </Text>
                  </Box>
                }
              </Box>
            </Box>
            {!oneAddress &&
              <Box mt='m'>
                <Text color='gray.2'
                  variant='b2'>Please enter a new wallet password below to complete account creation.</Text>
              </Box>
            }
            <Password label={oneAddress ? 'Wallet password' : 'Password'}
              withConfirm={!oneAddress} />
          </form>
        </FormProvider>
      </Box>

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
              disabled={submitIsDisabled}
              fluid
              form='accountForm'
              type='submit'>
              {submitText}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
