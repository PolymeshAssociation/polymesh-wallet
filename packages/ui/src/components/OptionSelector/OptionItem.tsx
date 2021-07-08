import { Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

import { StyledOptionListItem } from './styles';
import { OptionItem } from './types';

type OptionItemProps = {
  optionItem: OptionItem;
  onSelect: (value: any) =>void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function OptionListItem ({ onSelect, optionItem }: OptionItemProps): JSX.Element {
  return (
    <StyledOptionListItem disabled={optionItem.disabled}
      onClick={() => onSelect(optionItem.value)}>
      {typeof optionItem.label === 'string'
        ? (
          <Flex px='16px'
            py='8px'>
            <Text className='option-text'
              variant='b2m'>{optionItem.label}</Text>
          </Flex>
        )
        : (
          optionItem.label
        )}
    </StyledOptionListItem>
  );
}