import { ProofRequestPayload } from '@polymathnetwork/extension-core/types';
import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { ActionContext, ActivityContext, PolymeshContext } from '../../components';
import { approveProofRequest, rejectProofRequest, validatePassword } from '../../messaging';
import { ThemeProps } from '../../types';
import { Box, Button, Flex, Header, Heading, Icon, Text, TextInput } from '../../ui';
import { AccountMain } from '../Accounts/AccountMain';

interface Props {
  reqId: string;
  className?: string;
  isFirst: boolean;
  request: ProofRequestPayload;
  url: string;
}

function Request ({ isFirst, reqId, request, url }: Props): React.ReactElement<Props> {
  const { ticker } = request;
  const onAction = useContext(ActionContext);
  const { currentAccount } = useContext(PolymeshContext);
  const isBusy = useContext(ActivityContext);

  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: ''
    }
  });

  const _onApprove = useCallback(
    (password: string) =>
      approveProofRequest(reqId, password)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  const _onReject = useCallback(
    () =>
      rejectProofRequest(reqId)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  const onSubmit = async (data: { [x: string]: string }) => {
    const valid = await validatePassword(data.currentPassword);

    if (!valid) {
      setError('currentPassword', { type: 'WrongPassword' });
    } else {
      await _onApprove(data.currentPassword);
    }
  };

  return (
    <>
      <Flex
        flex={1}
        flexDirection='column'
        justifyContent='space-between'
        style={{ height: '100%', ...(isFirst ? {} : { display: 'none' }) }}
      >
        <form
          id='passwordForm'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box>
            <Header>{currentAccount && <AccountMain
              account={currentAccount}
              details={false}
            />}</Header>

            <Box>
              <Box
                mt='m'
                mx='s'
              >
                <Heading
                  mb={1}
                  variant='h5'
                >
                  {'Proof request'}
                </Heading>
                <Text
                  color='gray.2'
                  variant='b2'
                >
                  An application is requesting an attestation proof for asset &quot;{`${ticker}`}&quot; from{' '}
                  <a
                    href={url}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <span className='tab-url'>{new URL(url).hostname}</span>
                  </a>
                  .
                </Text>
              </Box>

              <Box pt='m'>
                <Box
                  borderColor='gray.4'
                  borderRadius={3}
                  borderStyle='solid'
                  borderWidth={2}
                  m='xs'
                  p='s'
                >
                  <Flex>
                    <Icon
                      Asset={SvgAlertCircle}
                      color='warning'
                      height={20}
                      width={20}
                    />
                    <Box ml='s'>
                      <Text
                        color='warning'
                        variant='b3m'
                      >
                        Attention
                      </Text>
                    </Box>
                  </Flex>
                  <Text
                    color='gray.1'
                    variant='b2m'
                  >
                    Only approve this request if you trust the application. By approving this connection, you may give
                    the application access to the key addresses of your accounts.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            mt='m'
            mx='s'
          >
            <Box>
              <Text
                color='gray.1'
                variant='b2m'
              >
                Wallet password
              </Text>
            </Box>
            <Box>
              <TextInput
                inputRef={register({ required: true })}
                name='currentPassword'
                placeholder='Enter wallet password'
                type='password'
              />
              {errors.currentPassword && (
                <Box>
                  <Text
                    color='alert'
                    variant='b3'
                  >
                    {errors.currentPassword.type === 'required' && 'Please enter wallet password'}
                    {errors.currentPassword.type === 'WrongPassword' && 'Invalid password'}
                    {errors.currentPassword.type === 'SigningError' && errors.currentPassword.message}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </form>

        <Flex
          mb='s'
          px='s'
          style={{ width: '100%' }}
        >
          <Flex flex={1}>
            <Button
              fluid
              onClick={_onReject}
              variant='secondary'
            >
              Reject
            </Button>
          </Flex>
          {isFirst && (
            <Flex
              flex={1}
              ml='xs'
            >
              <Flex
                flex={1}
                ml='xs'
              >
                <Button
                  busy={isBusy}
                  fluid
                  form='passwordForm'
                  type='submit'
                >
                  Generate proof
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default styled(Request)`
  .icon {
    background: ${({ theme }: ThemeProps): string => theme.buttonBackgroundDanger};
    color: white;
    min-width: 18px;
    width: 14px;
    height: 18px;
    font-size: 10px;
    line-height: 20px;
    margin: 16px 15px 0 1.35rem;
    font-weight: 800;
    padding-left: 0.5px;
  }

  .tab-info {
    overflow: hidden;
    margin: 0.75rem 20px 0 0;
  }

  .tab-name,
  .tab-url {
    color: ${({ theme }: ThemeProps): string => theme.textColor};
    display: inline-block;
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    cursor: pointer;
    text-decoration: underline;
  }
`;
