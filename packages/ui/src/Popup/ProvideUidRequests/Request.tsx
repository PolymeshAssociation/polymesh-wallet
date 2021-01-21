import { RequestPolyProvideUid } from '@polymathnetwork/extension-core/types';
import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { ActionContext, PolymeshContext } from '../../components';
import { approveProofRequest, rejectAuthRequest } from '../../messaging';
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

function Request ({ isFirst, reqId, request, url }: Props): React.ReactElement<Props> {
  const { address, did, network, uid } = request;
  const onAction = useContext(ActionContext);
  const { currentAccount } = useContext(PolymeshContext);

  const _onApprove = useCallback(
    () => approveProofRequest(reqId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  const _onReject = useCallback(
    () => rejectAuthRequest(reqId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [reqId, onAction]
  );

  return (
    <>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='space-between'
        style={{ height: '100%', ...(isFirst ? {} : { display: 'none' }) }}>
        <Box>
          <Header>
            {currentAccount && <AccountsHeader account={currentAccount}
              details={false} />}
          </Header>

          <Box>
            <Box mt='m'
              mx='s'>
              <Heading mb={1}
                variant='h5'>{'UID Provision Requests'}</Heading>
              <Text color='gray.2'
                variant='b2'>
                An application wants to provide a uID with the following details
                <a
                  href={url}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <span className='tab-url'>{(new URL(url)).hostname}</span>
                </a>.
              </Text>
              <Text>{address}</Text>
              <Text>{did}</Text>
              <Text>{uid}</Text>
              <Text>{network}</Text>
            </Box>

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
                  Only approve this request if you trust the application. By approving this connection, you may give the application access to the key addresses of your accounts.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Flex mb='s'
          px='s'
          style={{ width: '100%' }}>
          <Flex flex={1}>
            <Button
              fluid
              onClick={_onReject}
              variant='secondary'>
              Reject
            </Button>
          </Flex>
          {isFirst && <Flex flex={1}
            ml='xs'>
            <Button
              fluid
              onClick={_onApprove}
              type='submit'>
              Accept uID
            </Button>
          </Flex> }
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
