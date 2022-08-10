import { AuthUrlInfo } from '@polkadot/extension-base/background/handlers/State';
import {
  SvgWeb,
  SvgDelete,
} from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback } from 'react';

import { fontSizes } from '../../components/themeDefinitions';

interface Props {
  info: AuthUrlInfo;
  removeAuth: (url: string) => void;
  url: string;
}

function WebsiteEntry({ removeAuth, url }: Props): React.ReactElement<Props> {
  const remove = useCallback(() => {
    removeAuth(url);
  }, [removeAuth, url]);

  return (
    <Box px="s">
      <Flex direction="row">
        <Box pr={10}>
          <Icon Asset={SvgWeb} color="primary" height={20} width={20} />
        </Box>
        <Text lineHeight={fontSizes[4]} style={{ flex: '1 1' }} variant="b2m">
          {url}
        </Text>
        <Box width="108px" style={{ textAlign: 'right' }}>
          <Icon
            Asset={SvgDelete}
            onClick={remove}
            style={{ cursor: 'pointer' }}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default WebsiteEntry;
