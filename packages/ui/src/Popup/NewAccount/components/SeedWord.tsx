import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC } from 'react';

export interface Props {
  seedWord: string;
  wordOrder: number;
}

export const SeedWord: FC<Props> = ({ seedWord, wordOrder }) => {
  return (
    <Box backgroundColor='gray.4'
      borderRadius='1'
      mt='xs'
      px='s'>
      <Flex>
        <Box>
          <Flex alignItems='center'
            backgroundColor='brandLighter'
            borderRadius='50%'
            height={16}
            justifyContent='center'
            width={16}>
            <Text color='gray.0'
              variant='b3m'>{wordOrder + 1}</Text>
          </Flex>
        </Box>
        <Box ml='s'>
          <Text color='gray.1'
            variant='b2m'>{seedWord}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
