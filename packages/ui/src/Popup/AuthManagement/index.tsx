import type { ThemeProps } from '../../types';

import { AuthUrlInfo, AuthUrls } from '@polkadot/extension-base/background/handlers/State';
import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Header, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputFilter } from '../../components';
import { getAuthList, toggleAuthorization } from '../../messaging';
import WebsiteEntry from './WebsiteEntry';

interface Props extends ThemeProps {
  className?: string;
}

function AuthManagement ({ className }: Props): React.ReactElement<Props> {
  const [authList, setAuthList] = useState<AuthUrls | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getAuthList()
      .then(({ list }) => setAuthList(list))
      .catch((e) => console.error(e));
  }, []);

  const _onChangeFilter = useCallback((filter: string) => {
    setFilter(filter);
  }, []);

  const toggleAuth = useCallback((url: string) => {
    toggleAuthorization(url)
      .then(({ list }) => setAuthList(list))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header headerText='Manage Website Access'
        iconAsset={SvgFileLockOutline}>
        <Box mb='m'
          mt='s'>
          <Text color='gray.0'
            variant='b2'>
            Grant or deny these applications access to Polymesh Wallet.
          </Text>
        </Box>
      </Header>
      <Box m='s'>
        <Box>
          <Text color='gray.1'
            variant='b2m'>
            Filter by host name:
          </Text>
        </Box>
        <Box>
          <InputFilter
            onChange={_onChangeFilter}
            placeholder={'example.com'}
            value={filter}
          />
        </Box>
        <div className={className}>
          {
            !authList || !Object.entries(authList)?.length
              ? <div className='empty-list'>{'No website request yet!'}</div>
              : <>
                <div className='website-list'>
                  {Object.entries(authList)
                    .filter(([url]: [string, AuthUrlInfo]) => url.includes(filter))
                    .map(
                      ([url, info]: [string, AuthUrlInfo]) =>
                        <WebsiteEntry
                          info={info}
                          key={url}
                          toggleAuth={toggleAuth}
                          url={url}
                        />
                    )}
                </div>
              </>
          }
        </div>
      </Box>
    </>
  );
}

export default styled(AuthManagement)`
  height: 100%;
  overflow-y: auto;

  .empty-list {
    text-align: center;
  }
`;
