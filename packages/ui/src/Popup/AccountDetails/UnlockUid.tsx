import { Box, Button, Flex, Icon, icons, Text, TextInput } from '@polymathnetwork/polymesh-ui';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

export interface Props {
  decode: (password: string) => Promise<boolean>;
  onClose: () => void;
}

export const DecodeUid: FC<Props> = ({ decode, onClose }) => {
  const { clearErrors, errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: ''
    }
  });

  const onSubmit = async (data: { [x: string]: string }) => {
    clearErrors();
    const decodeResult = await decode(data.currentPassword);

    if (!decodeResult) {
      setError('currentPassword', { type: 'WrongPassword' });
    }
  };

  return (
    <>
      <Flex justifyContent='space-between'
        mx='s'
        my='s'>
        <Box>
          <Text color='gray.1'
            variant='c2'>
            SHOW MY DID
          </Text>
        </Box>
        <Box>
          <Icon
            Asset={icons.SvgClose}
            color='gray.3'
            height={14}
            onClick={onClose}
            style={{ cursor: 'pointer' }}
            width={14}
          />
        </Box>
      </Flex>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='space-between'
        mx='s'>
        <Box>
          <Box>
            <Text color='gray.2'
              variant='b2'>
              Your uID is a unique identifier attached to a single person or entity in the real world. A person or entity can have multiple Polymesh Accounts, but only one uID.
            </Text>
          </Box>
          <Box mt='m'>
            <Text color='gray.1'
              variant='b2m'>
              Password
            </Text>
          </Box>
          <Box mt='s'>
            <form id='passwordForm'
              onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                inputRef={register({ required: true })}
                name='currentPassword'
                placeholder='Enter wallet password'
                type='password'
              />
              {errors.currentPassword && (
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {errors.currentPassword.type === 'required' && 'Required field'}
                    {errors.currentPassword.type === 'WrongPassword' && 'Invalid password'}
                  </Text>
                </Box>
              )}
            </form>
          </Box>
        </Box>
        <Box style={{ width: '100%' }}>
          <Flex mb='s'
            style={{ width: '100%' }}>
            <Flex flex={1}>
              <Button fluid
                onClick={onClose}
                variant='secondary'>
                Cancel
              </Button>
            </Flex>
            <Flex flex={1}
              ml='xs'>
              <Button fluid
                form='passwordForm'
                type='submit'>
                Show my uID
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
