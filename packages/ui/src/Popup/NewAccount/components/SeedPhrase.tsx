import type { FC } from 'react';

import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { SvgCheckboxMarkedCircle, SvgContentCopy } from '@polymeshassociation/extension-ui/assets/images/icons';
import { styled } from '@polymeshassociation/extension-ui/styles';
import { Box, Button, Icon } from '@polymeshassociation/extension-ui/ui';

import { SeedWord } from './SeedWord';

export interface Props {
  seedPhrase?: string;
}

export const SeedPhrase: FC<Props> = ({ seedPhrase }) => {
  const [isCopied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    setCopied(true);
  }, []);

  return (
    <>
      <Box my='m'>
        <SeedGrid>
          {seedPhrase?.split(' ').map((word, index) => (
            <SeedWord
              key={index}
              seedWord={word}
              wordOrder={index}
            />
          ))}
        </SeedGrid>
      </Box>
      <CopyToClipboard
        onCopy={onCopy}
        text={seedPhrase || ''}
      >
        <Button
          fluid
          variant='secondary'
        >
          {isCopied
            ? (
              <>
                <Icon
                  Asset={SvgCheckboxMarkedCircle}
                  color='polyNavyBlue'
                  height={20}
                  width={20}
                />
                <Box ml='s'>Your recovery phrase copied</Box>
              </>
            )
            : (
              <>
                <Icon
                  Asset={SvgContentCopy}
                  color='polyNavyBlue'
                  height={20}
                  width={20}
                />
                <Box ml='s'>Copy your recovery phrase</Box>
              </>
            )}
        </Button>
      </CopyToClipboard>
    </>
  );
};

const SeedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6px;
`;
