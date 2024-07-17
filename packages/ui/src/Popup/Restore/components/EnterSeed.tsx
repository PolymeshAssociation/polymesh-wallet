import type { ChangeEvent, FC } from 'react';

import React, { useCallback, useState } from 'react';

import { Box, Button, Flex, Text, TextArea } from '@polymeshassociation/extension-ui/ui';

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
    } catch (_error) {
      return false;
    }
  };

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();

    setSeedPhrase(value);
    checkSeed(value).then(setValidSeed).catch(console.error);
  }, []);

  const nextStep = useCallback(() => {
    setPhrase(seedPhrase);

    onContinue();
  }, [onContinue, seedPhrase, setPhrase]);

  return (
    <Flex
      alignItems='stretch'
      flexDirection='column'
      height='100%'
      p='s'
    >
      <Text
        color='gray.1'
        variant='b2m'
      >
        12–word recovery phrase
      </Text>
      <TextArea
        height={236}
        invalid={!validSeed && seedPhrase.length > 0}
        onChange={onChange}
        placeholder='Enter your 12-word recovery phrase. Separate each word with a single space.'
      />
      <Box mt='auto'>
        <Button
          disabled={!validSeed}
          fluid
          onClick={nextStep}
        >
          Continue
        </Button>
      </Box>
    </Flex>
  );
};
