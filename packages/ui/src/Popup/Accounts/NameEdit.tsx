import { SvgCheck, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Icon, TextInput } from '@polymathnetwork/extension-ui/ui';
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
        <TextInput
          onChange={onChange}
          tight
          value={newName} />
        <Box ml='xs'>
          <Icon Asset={SvgCheck}
            color='gray.2'
            height={16}
            onClick={onSave}
            width={16} />
        </Box>
        <Box ml='xs'>
          <Icon Asset={SvgWindowClose}
            color='gray.2'
            height={16}
            onClick={onCancel}
            width={16} />
        </Box>
      </Flex>
    </Box>
  );
}
