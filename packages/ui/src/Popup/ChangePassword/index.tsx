import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { globalChangePass, validatePassword } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { ActionContext, ActivityContext, ValidationError } from '../../components';

export const ChangePassword: FC = () => {
  const onAction = useContext(ActionContext);
  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: string; }) => {
    const isValidPassword = await validatePassword(data.currentPassword);

    if (!isValidPassword) {
      setError('currentPassword', { type: 'manual' });

      return;
    }

    if (data.newPassword === data.currentPassword) {
      setError('newPassword', { type: 'nochange' });

      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual' });

      return;
    }

    const ret = await globalChangePass(data.currentPassword, data.confirmPassword);

    if (ret) {
      onAction('/');
    } else {
      setError('confirmPassword', { type: 'failed' });
    }
  };

  return (
    <>
      <Header headerText='Change password'
        iconAsset={SvgFileLockOutline}>
      </Header>
      <Box mx='s'>
        <form id='passwordForm'
          onSubmit={handleSubmit(onSubmit)}>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                Current password
              </Text>
            </Box>
            <Box className='currentPassword'>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='currentPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.currentPassword &&
                <ValidationError>
                  {(errors.currentPassword).type === 'required' && 'Required field'}
                  {(errors.currentPassword).type === 'minLength' && 'Password too short'}
                  {(errors.currentPassword).type === 'manual' && 'Invalid password'}
                </ValidationError>
              }
            </Box>
          </Box>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                New password
              </Text>
            </Box>
            <Box className='newPassword'>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='newPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.newPassword &&
                <ValidationError>
                  {(errors.newPassword).type === 'required' && 'Required field'}
                  {(errors.newPassword).type === 'minLength' && 'Password too short'}
                  {(errors.newPassword).type === 'manual' && 'Invalid password'}
                  {(errors.newPassword).type === 'nochange' && 'Current and new passwords are the same'}
                </ValidationError>
              }
            </Box>
          </Box>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                Confirm password
              </Text>
            </Box>
            <Box className='confirmPassword'>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='confirmPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.confirmPassword &&
                <ValidationError>
                  {(errors.confirmPassword).type === 'required' && 'Required field'}
                  {(errors.confirmPassword).type === 'minLength' && 'Password too short'}
                  {(errors.confirmPassword).type === 'manual' && 'Passwords do not match'}
                  {(errors.confirmPassword).type === 'failed' && 'Password change failed - Please contact Polymath support.'}
                </ValidationError>
              }
            </Box>
          </Box>
        </form>
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'>
        <Button busy={isBusy}
          fluid
          form='passwordForm'
          type='submit'>
          Change password
        </Button>
      </Flex>
    </>
  );
};
