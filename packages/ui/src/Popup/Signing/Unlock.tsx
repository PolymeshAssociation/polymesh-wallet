import { validateAccount } from '@polymathnetwork/extension-ui/messaging';
import React, { useContext, useEffect } from 'react';
import { FieldError, useForm } from 'react-hook-form';

import { ActivityContext, PolymeshContext } from '../../components';
import { Box, Button, Checkbox, Flex, Text, TextInput } from '../../ui';

interface Props {
  isFirst: boolean | undefined;
  isLocked: boolean;
  isSavedPass: boolean;
  onCancel: () => Promise<void>;
  error?: string | null;
  onIsSavedPassChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSign: (password: string) => Promise<void>;
}

function Unlock ({ error, isFirst, isLocked, isSavedPass, onCancel, onIsSavedPassChange, onSign }: Props): React.ReactElement<Props> {
  const isBusy = useContext(ActivityContext);
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
          <form id='passwordForm'
            onSubmit={handleSubmit(onSubmit)}>
            <Box mx='s'>
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
                {(errors.currentPassword).type === 'required' && 'Required field'}
                {(errors.currentPassword).type === 'WrongPassword' && 'Invalid password'}
                {(errors.currentPassword).type === 'SigningError' && (errors.currentPassword).message}
              </Text>
            </Box>
                }
              </Box>
            </Box>
          </form>
          <Box mb='s'
            mt='s'
            mx='s'>
            <Checkbox
              checked={isSavedPass}
              label={
                <Text color='gray.1'
                  fontSize='1'>
                  Don&apos;t ask me again for the next 15 minutes
                </Text>
              }
              onChange={onIsSavedPassChange}
            />
          </Box>
        </>
      ) }
      <Flex
        flexDirection='row'
        mb='s'
        mx='s'>
        <Flex flex={1}>
          <Button
            fluid
            onClick={onCancel}
            variant='secondary'>
            Reject
          </Button>
        </Flex>
        {isFirst && <Flex flex={1}
          ml='xs'>
          <Button busy={isBusy}
            fluid
            form='passwordForm'
            type='submit'>
            Sign
          </Button>
        </Flex> }
      </Flex>
    </>
  );
}

export default React.memo(Unlock);
