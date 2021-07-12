import { Box, Flex, Icon, icons, TextInput } from '@polymathnetwork/polymesh-ui';
import React from 'react';

type NameEditProps = {
  newName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.MouseEvent<HTMLElement>) => Promise<void>;
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
};

export function NameEdit ({ newName, onCancel, onChange, onSave }: NameEditProps): JSX.Element {
  return (
    <Box py='3px'>
      <Flex alignItems='center'
        flexDirection='row'>
        {/* FIXME: tight attr */}
        <TextInput
          onChange={onChange}
          small
          value={newName} />
        <Box ml='xs'>
          <Icon Asset={icons.SvgCheck}
            color='gray.2'
            height={16}
            onClick={onSave}
            width={16} />
        </Box>
        <Box ml='xs'>
          <Icon Asset={icons.SvgWindowClose}
            color='gray.2'
            height={16}
            onClick={onCancel}
            width={16} />
        </Box>
      </Flex>
    </Box>
  );
}
