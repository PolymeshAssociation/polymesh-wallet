import { RequestAuthorizeTab } from '@polkadot/extension-base/background/types';
import { ThemeProps } from '../../types';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Button, Box, Flex, Header, Icon, Text, Heading } from '../../ui';
import { ActionContext, PolymeshContext } from '../../components';
import { approveAuthRequest, rejectAuthRequest } from '../../messaging';
import { AccountsHeader } from '../Accounts/AccountsHeader';
import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';

interface Props {
  authId: string;
  className?: string;
  isFirst: boolean;
  request: RequestAuthorizeTab;
  url: string;
}

function Request ({ authId, isFirst, request: { origin }, url }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
  const { currentAccount } = useContext(PolymeshContext);

  const _onApprove = useCallback(
    () => approveAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  const _onReject = useCallback(
    () => rejectAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  return (
    <div style={{ display: isFirst ? 'block' : 'none', height: '100%' }}>
      <Header>
        {currentAccount && <AccountsHeader account={currentAccount}
          details={false} />}
      </Header>
      <Flex alignItems='stretch'
        flex={1}
        flexDirection='column'
        justifyContent='space-between'
        style={{ height: '100%' }}>
        <Box>
          <Box mt='m'
            mx='s'>
            <Heading mb={1}
              variant='h5'>{`${origin} is requesting access`}</Heading>
            <Text color='gray.2'
              variant='b2'>
              An application, self-identifying as <strong>{origin}</strong>
              {' '}is requesting access from{' '}
              <a
                href={url}
                rel='noopener noreferrer'
                target='_blank'
              >
                <span className='tab-url'>{url}</span>
              </a>.
            </Text>
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
        <Flex
          flexDirection='row'
          mb='l'
          mx='s'>
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
              Authorize
            </Button>
          </Flex> }
        </Flex>
      </Flex>
    </div>
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
