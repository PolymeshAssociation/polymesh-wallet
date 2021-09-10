import { SvgClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Button, Flex, Icon, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
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
        m='m'>
        <Box>
          <Text color='gray1'
            variant='c1'>
            SHOW MY uID
          </Text>
        </Box>
        <Icon
          Asset={SvgClose}
          color='gray5'
          height={14}
          onClick={onClose}
          style={{ cursor: 'pointer' }}
          width={14}
        />
      </Flex>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='space-between'
        mx='m'>
        <Box>
          <Box>
            <Text color='gray3'
              variant='b2'>
              Your uID is a unique identifier attached to a single person or entity in the real world. A person or entity can have multiple Polymesh Accounts, but only one uID.
            </Text>
          </Box>
          <Box mt='l'>
            <Text color='gray.1'
              variant='b2m'>
              Password
            </Text>
          </Box>
          <Box mt='xs'>
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
              ml='8px'>
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
