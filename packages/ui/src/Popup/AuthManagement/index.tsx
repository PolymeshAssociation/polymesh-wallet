import { AuthUrlInfo, AuthUrls } from '@polkadot/extension-base/background/handlers/State';
import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Header, Hr, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useEffect, useState } from 'react';

import { InputFilter } from '../../components';
import { getAuthList, toggleAuthorization } from '../../messaging';
import WebsiteEntry from './WebsiteEntry';

export function AuthManagement (): JSX.Element {
  const [authList, setAuthList] = useState<AuthUrls | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getAuthList()
      .then(({ list }) => setAuthList(list))
      .catch(console.error);
  }, []);

  const _onChangeFilter = useCallback((filter: string) => {
    setFilter(filter);
  }, []);

  const toggleAuth = useCallback((url: string) => {
    toggleAuthorization(url)
      .then(({ list }) => setAuthList(list))
      .catch(console.error);
  }, []);

  const hasAuthList = !!(authList && Object.entries(authList)?.length);

  return (
    <Flex flexDirection='column'
      height='100%'>
      <Header headerText='Manage connected dApps'
        iconAsset={SvgFileLockOutline}
        width='100%'>
        <Box mb='m'
          mt='s'>
          <Text color='gray.0'
            variant='b2'>
            Allow or deny these applications to connect to your Polymesh Wallet.
          </Text>
        </Box>
      </Header>
      {hasAuthList && (
        <Box p='s'
          width='100%'>
          <InputFilter onChange={_onChangeFilter}
            placeholder={'Search by website name...'}
            value={filter} />
        </Box>
      )}
      <Box py='s'
        style={{ overflowY: 'auto' }}
        width='100%'>
        {hasAuthList
          ? (
            Object.entries(authList as AuthUrls)
              .filter(([url]: [string, AuthUrlInfo]) => url.includes(filter))
              .map(([url, info]: [string, AuthUrlInfo]) => (
                <>
                  <WebsiteEntry info={info}
                    key={url}
                    toggleAuth={toggleAuth}
                    url={url} />
                  <Hr />
                </>

              ))
          )
          : (
            <Text as='div'
              textAlign='center'
              variant='b1m'>
              No website requests yet!
            </Text>
          )}
      </Box>
    </Flex>
  );
}
