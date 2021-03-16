import { RequestPolyProvideUid } from '@polymathnetwork/extension-core/types';
import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { ActionContext, ActivityContext, Password, PolymeshContext, UidContext } from '../../components';
import { approveUidProvideRequest, isPasswordSet, rejectUidProvideRequest, validatePassword } from '../../messaging';
import { ThemeProps } from '../../types';
import { Box, Button, Flex, Header, Heading, Icon, Text } from '../../ui';
import { AccountsHeader } from '../Accounts/AccountsHeader';

interface Props {
  reqId: string;
  className?: string;
  isFirst: boolean;
  request: RequestPolyProvideUid;
  url: string;
}

type FormInputs = {
  password: string;
  confirmPassword: string;
};

function Request ({ isFirst, reqId, request, url }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const uidRecords = useContext(UidContext);
  const { currentAccount, network } = useContext(PolymeshContext);
  const [overWriteUid, setOverWriteUid] = useState(false);
  const [hasExistingUid, setHasExistingUid] = useState(false);
  const [passIsSet, setPassIsSet] = useState<boolean>(false);

  useEffect(() => {
    isPasswordSet().then(setPassIsSet).catch(console.error);
  }, []);

  useEffect(() => {
    const uid = uidRecords?.find((item) => item.did === currentAccount?.did && network === item.network);

    setHasExistingUid(uid !== undefined);
  }, [uidRecords, currentAccount, network]);

  const isBusy = useContext(ActivityContext);

  const methods = useForm<FormInputs>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });
  const { handleSubmit, setError } = methods;

  const _onApprove = useCallback(
    (password: string) =>
      approveUidProvideRequest(reqId, password)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  const _onReject = useCallback(
    () =>
      rejectUidProvideRequest(reqId)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  const onSubmit = async (data: { [x: string]: string }) => {
    if (passIsSet) {
      const isValidPassword = await validatePassword(data.password);

      if (isValidPassword) {
        await _onApprove(data.password);
      } else {
        setError('password', { type: 'manual', message: 'Invalid password' });
      }
    } else {
      if (data.password === data.confirmPassword) {
        await _onApprove(data.password);
      } else {
        setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      }
    }
  };

  const acceptOverwrite = () => {
    setOverWriteUid(true);
  };

  return (
    <>
      <Flex
        flex={1}
        flexDirection='column'
        justifyContent='space-between'
        style={{ height: '100%', ...(isFirst ? {} : { display: 'none' }) }}
      >
        <Box>
          <Header>{currentAccount && <AccountsHeader account={currentAccount}
            details={false} />}</Header>

          <Box>
            <Box mt='m'
              mx='s'>
              <Heading mb={1}
                variant='h5'>
                UID Provision Requests
              </Heading>
              <Text color='gray.2'
                variant='b2'>
                An application wants to provide a uID with the following details{' '}
                <a href={url}
                  rel='noopener noreferrer'
                  target='_blank'>
                  <span className='tab-url'>{new URL(url).hostname}</span>
                </a>
                .
              </Text>
              <details>
                <summary>{request.uid}</summary>
                <pre style={{ width: '300px' }}>{JSON.stringify(request, null, 1)}</pre>
              </details>
            </Box>
          </Box>
        </Box>

        {hasExistingUid && !overWriteUid && (
          <Box pt='m'>
            <Box borderColor='gray.4'
              borderRadius={3}
              borderStyle='solid'
              borderWidth={2}
              m='xs'
              p='s'>
              <Flex>
                <Icon Asset={SvgAlertCircle}
                  color='warning'
                  height={20}
                  width={20} />
                <Box ml='s'>
                  <Text color='warning'
                    variant='b3m'>
                    Attention
                  </Text>
                </Box>
              </Flex>
              <Text color='gray.1'
                variant='b2m'>
                You already have an existing uID assigned to the current Polymesh identity, accepting this uID will
                overwrite the exisiting one. Do you like to accept?
              </Text>
            </Box>
            <Flex mb='s'
              px='s'
              style={{ width: '100%' }}>
              <Flex flex={1}>
                <Button fluid
                  onClick={_onReject}
                  variant='secondary'>
                  No
                </Button>
              </Flex>
              {isFirst && (
                <Flex flex={1}
                  ml='xs'>
                  <Button fluid
                    onClick={acceptOverwrite}
                    type='submit'>
                    Yes
                  </Button>
                </Flex>
              )}
            </Flex>
          </Box>
        )}
        {(!hasExistingUid || overWriteUid) && (
          <FormProvider {...methods} >

            <form id='passwordForm'
              onSubmit={handleSubmit(onSubmit)}>
              <Box pt='m'>
                <Box borderColor='gray.4'
                  borderRadius={3}
                  borderStyle='solid'
                  borderWidth={2}
                  m='xs'
                  p='s'>
                  <Flex>
                    <Icon Asset={SvgAlertCircle}
                      color='warning'
                      height={20}
                      width={20} />
                    <Box ml='s'>
                      <Text color='warning'
                        variant='b3m'>
                        Attention
                      </Text>
                    </Box>
                  </Flex>
                  <Text color='gray.1'
                    variant='b2m'>
                    Only approve this request if you trust the application. By approving this connection, you may give
                    the application access to the key addresses of your accounts.
                  </Text>
                </Box>
              </Box>

              <Flex flexDirection='column'
                mx='s'>
                <Box mb='s'
                  style={{ width: '100%' }}>
                  {!passIsSet && (
                    <Box mt='m'>
                      <Text color='gray.2'
                        variant='b2'>
                        Please enter a new wallet password below to complete uId provision.
                      </Text>
                    </Box>
                  )}
                  <Password label={passIsSet ? 'Wallet password' : 'Password'}
                    placeholder='Enter your current wallet password'
                    withConfirm={!passIsSet} />
                </Box>
              </Flex>
              <Flex mb='s'
                px='s'
                style={{ width: '100%' }}>
                <Flex flex={1}>
                  <Button fluid
                    onClick={_onReject}
                    variant='secondary'>
                    Reject
                  </Button>
                </Flex>
                {isFirst && (
                  <Flex flex={1}
                    ml='xs'>
                    <Button busy={isBusy}
                      fluid
                      form='passwordForm'
                      type='submit'>
                      Accept uID
                    </Button>
                  </Flex>
                )}
              </Flex>
            </form>
          </FormProvider>
        )}
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
