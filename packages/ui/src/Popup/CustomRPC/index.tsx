import {
  AuthUrlInfo,
  AuthUrls,
} from '@polkadot/extension-base/background/handlers/State';
import { SvgFileLockOutline } from '@polymeshassociation/extension-ui/assets/images/icons';
import { Box, Flex, Header, Hr, Text } from '@polymeshassociation/extension-ui/ui';
import React, { useCallback, useEffect, useState } from 'react';

import { RpcInput } from '../../components';
import { getAuthList, removeAuthorization } from '../../messaging';
import WebsiteEntry from './WebsiteEntry';

export function CustomRPC(): JSX.Element {
  // const [authList, setAuthList] = useState<AuthUrls | null>(null);
  const [customRpc, setCustomRpc] = useState('');

  // useEffect(() => {
  //   getAuthList()
  //     .then(({ list }) => setAuthList(list))
  //     .catch(console.error);
  // }, []);

  const _onChangeCustomRpc = useCallback((customRpc: string) => {
    setCustomRpc(customRpc);
  }, []);

  // const removeAuth = useCallback((url: string) => {
  //   removeAuthorization(url)
  //     .then(({ list }) => setAuthList(list))
  //     .catch(console.error);
  // }, []);

  // const hasAuthList = !!(authList && Object.entries(authList)?.length);

  return (
    <Flex flexDirection="column" height="100%">
      <Header
        headerText="Set Custom RPC"
        iconAsset={SvgFileLockOutline}
        width="100%"
      >
        <Box mb="m" mt="s">
          <Text color="gray.0" variant="b2">
            Use a custom RPC to read data from the Polymesh blockchain.
          </Text>
        </Box>
      </Header>
      <Box p="s" width="100%">
        <RpcInput
          onChange={_onChangeCustomRpc}
          placeholder={'Enter Custom RPC endpoint as wss://...'}
          value={customRpc}
        />
      </Box>
      <Button busy={isBusy} fluid form="passwordForm" type="submit">
          Set Custom RPC
      </Button>      
    </Flex>
  );
}
