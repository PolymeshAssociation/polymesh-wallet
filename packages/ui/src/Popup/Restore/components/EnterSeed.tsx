import { Box, Button, Flex, Text, TextArea } from '@polymathnetwork/extension-ui/ui';
import React, { ChangeEvent, FC, useState } from 'react';

import { validateSeed } from '../../../messaging';

export interface Props {
  onContinue: () => void;
  setPhrase: (phrase: string) => void;
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
    <Flex alignItems='stretch'
      flexDirection='column'
      height='100%'
      p='s'>
      <Text color='gray.1'
        variant='b2m'>
        12–word recovery phrase
      </Text>
      <TextArea
        height={236}
        invalid={!validSeed && seedPhrase.length > 0}
        onChange={onChange}
        placeholder='Enter your 12-word recovery phrase. Separate each word with a single space.'
      />
      <Box mt='auto'>
        <Button disabled={!validSeed}
          fluid
          onClick={nextStep}>
          Continue
        </Button>
      </Box>
    </Flex>
  );
};
