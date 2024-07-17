import type { FC } from 'react';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { SvgAccountCardDetailsOutline, SvgAlertCircle, SvgArrowLeft } from '@polymeshassociation/extension-ui/assets/images/icons';
import { ActivityContext, Password } from '@polymeshassociation/extension-ui/components';
import { isPasswordSet, validatePassword } from '@polymeshassociation/extension-ui/messaging';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymeshassociation/extension-ui/ui';

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
  noHeader?: boolean;
}

interface FormInputs {
  accountName: string;
  password: string;
  confirmPassword: string;
}

export const AccountForm: FC<Props> = ({ defaultName,
  headerText,
  noHeader,
  onBack,
  onContinue,
  submitText }) => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      accountName: defaultName || '',
      confirmPassword: '',
      password: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, formState, getValues, handleSubmit, register, setError } =
    methods;
  const isBusy = useContext(ActivityContext);
  const [passIsSet, setPassIsSet] = useState<boolean>(false);

  useEffect(() => {
    isPasswordSet().then(setPassIsSet).catch(console.error);
  }, []);

  const onSubmit = useCallback(async (data: Record<string, string>) => {
    if (passIsSet) {
      const isValidPassword = await validatePassword(data.password);

      if (isValidPassword) {
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('password', {
          message: 'Invalid password',
          type: 'manual'
        });
      }
    } else {
      if (data.password === data.confirmPassword) {
        onContinue({ accountName: data.accountName, password: data.password });
      } else {
        setError('confirmPassword', {
          message: 'Passwords do not match',
          type: 'manual'
        });
      }
    }
  }, [onContinue, passIsSet, setError]);

  const submitIsDisabled =
    !formState.isValid ||
    Object.keys(errors).length > 0 ||
    Object.values(getValues()).filter((val) => val === '').length > 0 ||
    formState.isSubmitting;

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    handleSubmit(onSubmit)(e).catch(console.error);
  }, [handleSubmit, onSubmit]);

  return (
    <>
      {!noHeader && (
        <Header
          headerText={headerText}
          iconAsset={SvgAccountCardDetailsOutline}
        />
      )}
      <Box mx='s'>
        {passIsSet && (
          <Box
            borderColor='gray.4'
            borderRadius={3}
            borderStyle='solid'
            borderWidth={2}
            mt='s'
            p='s'
          >
            <Flex mb='xs'>
              <Icon
                Asset={SvgAlertCircle}
                color='warning'
                height={20}
                width={20}
              />
              <Box ml='s'>
                <Text
                  color='warning'
                  variant='b2m'
                >
                  Attention
                </Text>
              </Box>
            </Flex>
            <Text
              color='gray.1'
              variant='b2m'
            >
              Enter your current wallet password in order to add this account.
            </Text>
          </Box>
        )}
        <FormProvider {...methods}>
          <form
            id='accountForm'
            onSubmit={handleFormSubmit}
          >
            <Box mt='m'>
              <Box>
                <Text
                  color='gray.1'
                  variant='b2m'
                >
                  Account name
                </Text>
              </Box>
              <Box>
                <TextInput
                  inputRef={register({ required: true })}
                  name='accountName'
                  placeholder='Enter account name'
                />
                {errors?.accountName && (
                  <Box>
                    <Text
                      color='alert'
                      variant='b3'
                    >
                      {errors.accountName.type === 'required' &&
                        'Required field'}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            {!passIsSet && (
              <Box mt='m'>
                <Text
                  color='gray.2'
                  variant='b2'
                >
                  Please enter a new wallet password below to complete account
                  creation.
                </Text>
              </Box>
            )}
            <Password
              label={passIsSet ? 'Wallet password' : 'Password'}
              placeholder='Enter your current wallet password'
              withConfirm={!passIsSet}
            />
          </form>
        </FormProvider>
      </Box>
      <Flex
        flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        m='s'
      >
        <Flex
          mb='s'
          width='100%'
        >
          <Button
            minsize
            onClick={onBack}
            style={{ padding: '0.9rem' }}
            variant='secondary'
          >
            <Icon
              Asset={SvgArrowLeft}
              color='polyNavyBlue'
              height={16}
              width={16}
            />
          </Button>
          <Box
            ml='s'
            width='100%'
          >
            <Button
              busy={isBusy}
              disabled={submitIsDisabled}
              fluid
              form='accountForm'
              type='submit'
            >
              {submitText}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
