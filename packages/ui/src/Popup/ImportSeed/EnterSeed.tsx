import { SvgClipboardListOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Button, Flex, Header, Text, TextArea } from '@polymathnetwork/extension-ui/ui';
import React, { ChangeEvent, FC, useState } from 'react';

import { validateSeed } from '../../messaging';

export interface Props {
  onContinue: () => void;
  setPhrase: (phrase:string) => void;
}

export const EnterSeed: FC<Props> = ({ onContinue, setPhrase }) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [validSeed, setValidSeed] = useState(false);

  const checkSeed = async (seed: string) => {
    try {
      await validateSeed(seed);

      return true;
    } catch (error) {
      return false;
    }
  };

  const onChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();

    setSeedPhrase(value);

    setValidSeed(await checkSeed(value));
  };

  const nextStep = () => {
    setPhrase(seedPhrase);

    onContinue();
  };

  return (
    <>
      <Header headerText='Restore your account with your recovery phrase'
        iconAsset={SvgClipboardListOutline}>
      </Header>
      <Box mx='s'>
        <Box pt='m'>
          <Text color='gray.1'
            variant='b2m'>
            12–word recovery phrase
          </Text>
        </Box>
        <Box>
          <TextArea height={272}
            invalid={!validSeed && seedPhrase.length > 0}
            onChange={onChange}
            placeholder='Enter your 12-word recovery phrase. Separate each word with a single space.' />
          <Box mt='s'>
            <Text color='alert'
              variant='b3'>
              {!validSeed && seedPhrase.length > 0 && 'Recovery phrase is invalid.'}
            </Text>
          </Box>
        </Box>
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'>
        <Button disabled={!validSeed}
          fluid
          onClick={nextStep}>
          Continue
        </Button>
      </Flex>
    </>
  );
};
