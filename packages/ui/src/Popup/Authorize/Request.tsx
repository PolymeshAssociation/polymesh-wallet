import { RequestAuthorizeTab } from '@polkadot/extension-base/background/types';
import { SvgAlertCircle } from '@polymeshassociation/extension-ui/assets/images/icons';
import { truncateString } from '@polymeshassociation/extension-ui/util/formatters';
import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';

import {
  ActionContext,
  PolymeshContext,
  AccountContext,
} from '../../components';
import { approveAuthRequest, deleteAuthRequest } from '../../messaging';
import { ThemeProps } from '../../types';
import { Box, Button, Flex, Header, Heading, Icon, Text } from '../../ui';
import { AccountMain } from '../Accounts/AccountMain';

interface Props {
  authId: string;
  className?: string;
  isFirst: boolean;
  request: RequestAuthorizeTab;
  url: string;
}

function Request({
  authId,
  isFirst,
  request: { origin },
  url,
}: Props): React.ReactElement<Props> {
  const { selectedAccounts = [], setSelectedAccounts } =
    useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const { currentAccount } = useContext(PolymeshContext);

  useEffect(() => {
    setSelectedAccounts && setSelectedAccounts([]);
  }, [setSelectedAccounts]);

  const _onApprove = useCallback(
    () =>
      approveAuthRequest(authId, selectedAccounts)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [authId, onAction, selectedAccounts]
  );

  const _onReject = useCallback(
    () =>
      deleteAuthRequest(authId)
        .then(() => onAction())
        .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  return (
    <>
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        style={{ height: '100%', ...(isFirst ? {} : { display: 'none' }) }}
      >
        <Box>
          <Header>
            {currentAccount && (
              <AccountMain account={currentAccount} details={false} />
            )}
          </Header>

          <Box>
            <Box mt="m" mx="s">
              <Heading mb={1} variant="h5">
                {'An application is requesting access'}
              </Heading>
              <Text color="gray.2" variant="b2">
                An application, self-identifying as{' '}
                <strong>{truncateString(origin, 40)}</strong> is requesting
                access from{' '}
                <a href={url} rel="noopener noreferrer" target="_blank">
                  <span className="tab-url">{new URL(url).hostname}</span>
                </a>
                .
              </Text>
            </Box>

            <Box pt="m">
              <Box
                borderColor="gray.4"
                borderRadius={3}
                borderStyle="solid"
                borderWidth={2}
                m="xs"
                p="s"
              >
                <Flex>
                  <Icon
                    Asset={SvgAlertCircle}
                    color="warning"
                    height={20}
                    width={20}
                  />
                  <Box ml="s">
                    <Text color="warning" variant="b3m">
                      Attention
                    </Text>
                  </Box>
                </Flex>
                <Text color="gray.1" variant="b2m">
                  Only approve this request if you trust the application. By
                  approving this connection, you may give the application access
                  to the key addresses of your accounts.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Flex mb="s" px="s" style={{ width: '100%' }}>
          <Flex flex={1}>
            <Button fluid onClick={_onReject} variant="secondary">
              Reject
            </Button>
          </Flex>
          {isFirst && (
            <Flex flex={1} ml="xs">
              <Button fluid onClick={_onApprove} type="submit">
                Authorize
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default styled(Request)`
  .icon {
    background: ${({ theme }: ThemeProps): string =>
    theme.buttonBackgroundDanger};
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
