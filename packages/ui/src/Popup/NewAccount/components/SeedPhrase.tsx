import { SvgCheckboxMarkedCircle, SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { SeedWord } from './SeedWord';

export interface Props {
  seedPhrase?: string;
}

export const SeedPhrase: FC<Props> = ({ seedPhrase }) => {
  const [isCopied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
  };

  return (
    <Box>
      <Box my='m'>
        <SeedGrid>
          {seedPhrase?.split(' ').map((word, index) => (
            <SeedWord key={index}
              seedWord={word}
              wordOrder={index} />
          ))}
        </SeedGrid>
      </Box>
      { !isCopied &&
        <CopyToClipboard onCopy={onCopy}
          text={seedPhrase || ''}>
          <Flex alignItems='center'
            justifyContent='center'
            mt='m'
            style={{ cursor: 'pointer' }}>
            <Box>
              <Flex>
                <Icon Asset={SvgContentCopy}
                  color='gray.3'
                  height={15}
                  width={15} />
                <Box ml='s'>
                  <Text color='gray.1'
                    variant='b2'>Copy your recovery phrase</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </CopyToClipboard>
      }
      {
        isCopied &&
          <Flex alignItems='center'
            justifyContent='center'
            mt='m'>
            <Box>
              <Flex>
                <Icon Asset={SvgCheckboxMarkedCircle}
                  color='success'
                  height={15}
                  width={15} />
                <Box ml='s'>
                  <Text color='success'
                    variant='b2'>Your recovery phrase copied</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
      }
    </Box>
  );
};

const SeedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6px;
`;
