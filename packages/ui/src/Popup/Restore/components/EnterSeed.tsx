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
    setSeedPhrase(e.target.value);

    setValidSeed(await checkSeed(e.target.value));
  };

  const nextStep = () => {
    setPhrase(seedPhrase);

    onContinue();
  };

  return (
    <>
      <Box height={270}
        mx='s'>
        <Box pt='m'>
          <Text color='gray.1'
            variant='b2m'>
            12–word recovery phrase
          </Text>
        </Box>
        <Box>
          <TextArea
            height={188}
            invalid={!validSeed && seedPhrase.length > 0}
            onChange={onChange}
            placeholder='Enter your 12-word recovery phrase. Separate each word with a single space.'
          />
        </Box>
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mt='l'
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
