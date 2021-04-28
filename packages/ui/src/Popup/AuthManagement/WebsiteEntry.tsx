import { AuthUrlInfo } from '@polkadot/extension-base/background/handlers/State';
import { SvgWeb } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Switch } from '@polymathnetwork/extension-ui/components';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback } from 'react';

interface Props {
  info: AuthUrlInfo;
  toggleAuth: (url: string) => void
  url: string;
}

function WebsiteEntry ({ info, toggleAuth, url }: Props): React.ReactElement<Props> {
  const switchAccess = useCallback(() => {
    toggleAuth(url);
  }, [toggleAuth, url]);

  return (
    <Box px='s'>
      <Flex direction='row'>
        <Box pr={10}>
          <Icon Asset={SvgWeb}
            color='primary'
            height={20}
            width={20}
          />
        </Box>
        <Text style={{ flex: 1 }}
          variant='b2m'>{url}</Text>
        <Switch
          checked={info.isAllowed}
          checkedLabel={'Allowed'}
          className='info'
          onChange={switchAccess}
          uncheckedLabel={'Denied'}
        />
      </Flex>
    </Box>
  );
}

export default WebsiteEntry;
