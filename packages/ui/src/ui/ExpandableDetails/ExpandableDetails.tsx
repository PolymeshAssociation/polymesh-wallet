import type { PropsWithChildren } from 'react';

import React, { useCallback, useState } from 'react';

import { SvgChevronDown, SvgChevronUp } from '@polymeshassociation/extension-ui/assets/images/icons';

import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type Props = PropsWithChildren<{
  title: string;
}>;

export function ExpandableDetails ({ children, title }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  const handleHeaderKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }, [toggle]);

  return (
    <Box>
      <Flex
        alignItems='center'
        aria-expanded={expanded}
        justifyContent='space-between'
        onClick={toggle}
        onKeyDown={handleHeaderKeyDown}
        px='s'
        py='xs'
        role='button'
        style={{ cursor: 'pointer' }}
        tabIndex={0}
      >
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            color='gray.2'
            variant='b3m'
          >
            {title}
          </Text>
        </Box>
        <Box style={{ flexShrink: 0 }}>
          <Icon
            Asset={expanded ? SvgChevronUp : SvgChevronDown}
            color='gray.3'
            height={24}
            width={24}
          />
        </Box>
      </Flex>
      {expanded && (
        <Box
          pb='xs'
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
