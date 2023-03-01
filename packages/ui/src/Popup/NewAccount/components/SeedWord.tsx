import { Box, Flex, Text } from '@polymeshassociation/extension-ui/ui';
import React, { FC } from 'react';

export interface Props {
  seedWord: string;
  wordOrder: number;
}

export const SeedWord: FC<Props> = ({ seedWord, wordOrder }) => {
  return (
    <Flex
      backgroundColor="gray8"
      borderRadius="3"
      height="24px"
      px="8px"
      width="min-content"
    >
      <Flex
        alignItems="center"
        backgroundColor="brandMain"
        borderRadius="50%"
        height={16}
        justifyContent="center"
        width={16}
      >
        <Text color="white" variant="b3m">
          {wordOrder + 1}
        </Text>
      </Flex>
      <Box ml="4px">
        <Text color="gray1" variant="b2m">
          {seedWord}
        </Text>
      </Box>
    </Flex>
  );
};
