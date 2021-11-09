import { SvgClipboardListOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Header,
  Text,
} from '@polymathnetwork/extension-ui/ui';
import React, { FC, useState } from 'react';

import { SeedPhrase } from './components/SeedPhrase';

export interface Props {
  seedPhrase?: string;
  onContinue: () => void;
}

export const SeedView: FC<Props> = ({ onContinue, seedPhrase }) => {
  const [isCopied, setCopied] = useState(false);

  return (
    <>
      <Header
        headerText="Your recovery phrase"
        iconAsset={SvgClipboardListOutline}
      >
        <Box mt="s">
          <Text color="white" variant="b2">
            These 12 words in order will recover your account should you lose or
            forget your password. It is recommended you store a hard copy in a
            secure place.
          </Text>
        </Box>
      </Header>
      <Box mx="m">
        <SeedPhrase seedPhrase={seedPhrase} />
      </Box>
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="flex-end"
        mx="m"
        my="m"
      >
        <Box>
          <Flex justifyContent="flex-start" mb="s">
            <Checkbox
              checked={isCopied}
              label={
                <Text
                  color="gray.3"
                  fontSize="0"
                  lineHeight="extraTight"
                  variant="b3"
                >
                  I confirm that I copied and stored the recovery phrase in a
                  secure place.
                </Text>
              }
              onClick={() => setCopied(!isCopied)}
            />
          </Flex>
          <Button disabled={!isCopied} fluid onClick={onContinue}>
            Continue
          </Button>
        </Box>
      </Flex>
    </>
  );
};
