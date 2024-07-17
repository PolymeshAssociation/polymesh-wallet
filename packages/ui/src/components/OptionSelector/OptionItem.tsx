import type { OptionItem } from './types';

import React, { useCallback } from 'react';

import { Box, Flex, Text } from '@polymeshassociation/extension-ui/ui';

import { StyledOptionListItem } from './styles';

interface OptionItemProps {
  optionItem: OptionItem;
  onSelect: (value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function OptionListItem ({ onSelect,
  optionItem }: OptionItemProps): React.ReactElement {
  const onClick = useCallback(() => optionItem.disabled ? undefined : onSelect(optionItem.value), [onSelect, optionItem.disabled, optionItem.value]);

  return (
    <StyledOptionListItem
      disabled={optionItem.disabled}
      onClick={onClick}
    >
      {typeof optionItem.label === 'string'
        ? (
          <Flex
            px='16px'
            py='8px'
          >
            {optionItem.icon && <Box mr='s'>{optionItem.icon}</Box>}
            <Text
              className='option-text'
              variant='b2m'
            >
              {optionItem.label}
            </Text>
          </Flex>
        )
        : (
          optionItem.label
        )}
    </StyledOptionListItem>
  );
}
