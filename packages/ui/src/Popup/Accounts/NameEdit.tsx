import React, { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import {
  SvgCheck,
  SvgWindowClose,
} from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Icon, TextInput } from '@polymathnetwork/extension-ui/ui';

type NameEditProps = {
  newName?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave: (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => Promise<void>;
  onCancel: (e: MouseEvent<HTMLElement>) => void;
};

export function NameEdit({
  newName,
  onCancel,
  onChange,
  onSave,
}: NameEditProps): JSX.Element {
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') onSave(e);
  };

  return (
    <Flex alignItems="center" flexDirection="row">
      <TextInput
        autoFocus
        onChange={onChange}
        onKeyDown={handleKeyDown}
        style={{ height: '20px' }}
        tight
        value={newName}
      />
      <Box ml="xs">
        <Icon
          Asset={SvgCheck}
          color="gray.2"
          height={16}
          onClick={onSave}
          width={16}
        />
      </Box>
      <Box ml="xs">
        <Icon
          Asset={SvgWindowClose}
          color="gray.2"
          height={16}
          onClick={onCancel}
          width={16}
        />
      </Box>
    </Flex>
  );
}
