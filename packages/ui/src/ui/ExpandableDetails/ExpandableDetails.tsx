import { SvgChevronDown, SvgChevronUp } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { FC, useState } from 'react';

import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';

export interface Props {
  title: string;
}

export const ExpandableDetails: FC<Props> = ({ children, title }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);

  return (
    <Box style={{ position: 'relative' }}>
      <Box style={{ position: 'absolute', overflowY: 'scroll' }}>
        <Flex
          justifyContent='space-between'
          mx='s'
        >
          <Box>
            <Text variant='code'>{title}</Text>
          </Box>
          <Box>
            <Icon
              Asset={expanded ? SvgChevronUp : SvgChevronDown}
              color='gray.3'
              height={24}
              onClick={toggle}
              style={{ cursor: 'pointer' }}
              width={24}
            />
          </Box>
        </Flex>
        {
          expanded &&
          <Box>{children}</Box>
        }
      </Box>
    </Box>
  );
};
