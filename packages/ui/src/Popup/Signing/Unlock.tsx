import React, { useContext, useEffect } from 'react';

import useTranslation from '../../hooks/useTranslation';
import { Button, Box, Checkbox, Text, Flex, TextInput } from '../../ui';
import { FieldError, useForm } from 'react-hook-form';
import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import { PolymeshContext } from '../../components';

interface Props {
  isFirst: boolean | undefined;
  buttonText: string;
  isLocked: boolean;
  isSavedPass: boolean;
  onCancel: () => Promise<void>;
  error?: string | null;
  onIsSavedPassChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSign: (password: string) => Promise<void>;
}

function Unlock ({ buttonText, error, isFirst, isLocked, isSavedPass, onCancel, onIsSavedPassChange, onSign }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { selectedAccount } = useContext(PolymeshContext);

  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: ''
    }
  });

  useEffect((): void => {
    setError('currentPassword', { type: 'SigningError' });
  }, [error, setError]);

  const onSubmit = async (data: { [x: string]: string; }) => {
    if (!selectedAccount) {
      throw new Error('No account is selected');
    }

    const valid = await validateAccount(selectedAccount, data.currentPassword);

    if (!valid) {
      setError('currentPassword', { type: 'WrongPassword' });
    } else {
      await onSign(data.currentPassword);
    }
  };

  return (
    <>
      {isLocked && (
        <>
          <Checkbox
            checked={isSavedPass}
            label={t<string>("Don't ask me again for the next 15 minutes")}
            onChange={onIsSavedPassChange}
          />
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
                <TextInput inputRef={register({ required: true })}
                  name='currentPassword'
                  placeholder='Enter wallet password'
                  type='password' />
                {errors.currentPassword &&
            <Box>
              <Text color='alert'
                variant='b3'>
                {(errors.currentPassword as FieldError).type === 'required' && 'Required field'}
                {(errors.currentPassword as FieldError).type === 'WrongPassword' && 'Invalid password'}
                {(errors.currentPassword as FieldError).type === 'SigningError' && (errors.currentPassword as FieldError).message}
              </Text>
            </Box>
                }
              </Box>
            </Box>
          </form>
        </>
      ) }
      <Flex flex={2}
        flexDirection='row'
        mb='s'
        mx='xs'>

        {isFirst && <Box>
          <Button
            fluid
            form='passwordForm'
            type='submit'>
            {buttonText}
          </Button>
        </Box> }
        <Box>
          <Button
            fluid
            onClick={onCancel}>
            {t<string>('Reject')}
          </Button>
        </Box>
      </Flex>
    </>
  );
}

export default React.memo(Unlock);
