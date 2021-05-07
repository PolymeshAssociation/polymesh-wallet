import { SvgAccountCardDetailsOutline, SvgAlertCircle, SvgArrowLeft } from '@polymathnetwork/extension-ui/assets/images/icons';
import { ActivityContext, Password } from '@polymathnetwork/extension-ui/components';
import { isPasswordSet, validatePassword } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

type FormInputs = {
  accountName: string;
  password: string;
  confirmPassword: string;
};

export const AccountForm: FC<Props> = ({ defaultName, headerText, noHeader, onBack, onContinue, submitText }) => {
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
  const [passIsSet, setPassIsSet] = useState<boolean>(false);

  useEffect(() => {
    isPasswordSet().then(setPassIsSet).catch(console.error);
  }, []);

  const onSubmit = async (data: { [x: string]: string }) => {
    if (passIsSet) {
      const isValidPassword = await validatePassword(data.password);

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

  const submitIsDisabled =
    !formState.isValid ||
    Object.keys(errors).length > 0 ||
    Object.values(getValues()).filter((val) => val === '').length > 0 ||
    formState.isSubmitting;

  return (
    <>
      {!noHeader && <Header headerText={headerText}
        iconAsset={SvgAccountCardDetailsOutline}></Header>}
      <Box mx='s'>
        {passIsSet && <Box borderColor='gray.4'
          borderRadius={3}
          borderStyle='solid'
          borderWidth={2}
          mt='s'
          p='s'>
          <Flex mb='xs'>
            <Icon Asset={SvgAlertCircle}
              color='warning'
              height={20}
              width={20} />
            <Box ml='s'>
              <Text color='warning'
                variant='b2m'>
                Attention
              </Text>
            </Box>
          </Flex>
          <Text color='gray.1'
            variant='b2m'>
            Enter your current wallet password in order to add this account.
          </Text>
        </Box> }
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
                <TextInput
                  inputRef={register({ required: true })}
                  name='accountName'
                  placeholder='Enter account name'
                />
                {errors?.accountName && (
                  <Box>
                    <Text color='alert'
                      variant='b3'>
                      {errors.accountName.type === 'required' && 'Required field'}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            {!passIsSet && (
              <Box mt='m'>
                <Text color='gray.2'
                  variant='b2'>
                  Please enter a new wallet password below to complete account creation.
                </Text>
              </Box>
            )}
            <Password label={passIsSet ? 'Wallet password' : 'Password'}
              placeholder='Enter your current wallet password'
              withConfirm={!passIsSet} />
          </form>
        </FormProvider>
      </Box>

      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        m='s'>
        <Flex mb='s'
          width='100%'>
          <Button minsize
            onClick={onBack}
            variant='secondary'>
            <Icon Asset={SvgArrowLeft}
              color='gray.1'
              height={16}
              width={16} />
          </Button>
          <Box ml='s'
            width='100%'>
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
