import { AuthUrlInfo } from '@polkadot/extension-base/background/handlers/State';
import { Switch } from '@polymathnetwork/extension-ui/components';
import { Box, Flex, Icon, icons, Text, theme } from '@polymathnetwork/polymesh-ui';
import React, { useCallback } from 'react';

interface Props {
  info: AuthUrlInfo;
  toggleAuth: (url: string) => void;
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
          <Icon Asset={icons.SvgWeb}
            color='primary'
            height={20}
            width={20} />
        </Box>
        <Text lineHeight={theme.fontSizes[4]}
          style={{ flex: '1 1' }}
          variant='b2m'>
          {url}
        </Text>
        <Box width='108px'>
          <Switch
            checked={info.isAllowed}
            checkedLabel={'Allowed'}
            className='info'
            onChange={switchAccess}
            uncheckedLabel={'Denied'}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default WebsiteEntry;
