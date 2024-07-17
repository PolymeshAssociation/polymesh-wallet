import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

import React, { useCallback } from 'react';

import { SvgCheck, SvgWindowClose } from '@polymeshassociation/extension-ui/assets/images/icons';
import { Box, Flex, Icon, TextInput } from '@polymeshassociation/extension-ui/ui';

interface NameEditProps {
  newName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave: (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => Promise<void>;
  onCancel: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

export function NameEdit ({ newName,
  onCancel,
  onChange,
  onSave }: NameEditProps): React.ReactElement {
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      onSave(e).catch(console.error);
    } else if (e.key === 'Escape') {
      onCancel(e);
    }
  }, [onCancel, onSave]);

  return (
    <Flex
      alignItems='center'
      flexDirection='row'
    >
      <TextInput
        autoFocus
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={{ height: '20px' }}
        tight
        value={newName}
      />
      <Box ml='xs'>
        <Icon
          Asset={SvgCheck}
          color='gray.2'
          height={16}
          onClick={onSave}
          width={16}
        />
      </Box>
      <Box ml='xs'>
        <Icon
          Asset={SvgWindowClose}
          color='gray.2'
          height={16}
          onClick={onCancel}
          width={16}
        />
      </Box>
    </Flex>
  );
}
