// FIXME : icons, Checkbox
import { SvgClipboardListOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Header } from '@polymathnetwork/extension-ui/ui';
import { Box, Button, Checkbox, Flex, Text } from '@polymathnetwork/polymesh-ui';
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
      <Header headerText='Your recovery phrase'
        iconAsset={SvgClipboardListOutline}>
        <Box
          mb='m'
          mt='s'>
          <Text color='brandLightest'
            variant='b3'>
            These 12 words in order will recover your account should you lose or forget your password. It is recommended you store a hard copy in a secure place.
          </Text>
        </Box>
      </Header>
      <Box mx='s'>
        <SeedPhrase seedPhrase={seedPhrase} />
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'>
        <Box>
          <Flex justifyContent='flex-start'
            mb='s'>
            <Checkbox
              checked={isCopied}
              onClick={() => setCopied(!isCopied)}
            />
            <Flex ml='s'
              mt='xs'>
              <Text color='gray.3'
                fontSize='0'
                lineHeight='extraTight'
                variant='b3'>
                I confirm that I copied and stored the recovery phrase in a secure place.
              </Text>
            </Flex>
          </Flex>
          <Button disabled={!isCopied}
            fluid
            onClick={onContinue}>
            Continue
          </Button>
        </Box>
      </Flex>
    </>
  );
};
