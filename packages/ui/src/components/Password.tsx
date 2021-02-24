import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Text, TextInput } from '../ui';

export interface Props {
  label: string;
  confirmLabel?: string;
  withConfirm?: boolean;
  placeholder?: string;
}

export const Password: FC<Props> = ({ confirmLabel, label, placeholder, withConfirm }) => {
  const { errors, getValues, register } = useFormContext();

  const validatePassword = (value: string) => {
    const password = getValues('password') as string;

    return password === value;
  };

  return (
    <>
      <Box mt='m'>
        <Box>
          <Text color='gray.1'
            variant='b2m'>
            {label}
          </Text>
        </Box>
        <Box>
          <TextInput inputRef={register({ required: true, minLength: 8 })}
            name='password'
            placeholder={placeholder || 'Enter 8 characters or more'}
            type='password' />
          {errors.password &&
            <Box>
              <Text color='alert'
                variant='b3'>
                {errors.password?.type === 'minLength' && 'Password too short'}
                {errors.password?.type === 'manual' && 'Invalid password'}
              </Text>
            </Box>
          }
        </Box>
      </Box>
      {withConfirm &&
        <Box mt='m'>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {confirmLabel && confirmLabel !== '' ? confirmLabel : 'Confirm password'}
            </Text>
          </Box>
          <Box>
            <TextInput inputRef={register({ required: true, minLength: 8, validate: validatePassword })}
              name='confirmPassword'
              placeholder='Confirm your password'
              type='password' />
            {errors.confirmPassword &&
              <Box>
                <Text color='alert'
                  variant='b3'>
                  Passwords do not match
                </Text>
              </Box>
            }
          </Box>
        </Box>
      }
    </>
  );
};
