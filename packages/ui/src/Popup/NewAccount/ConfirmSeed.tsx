import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, ButtonSmall, Flex, Header, Heading, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import { SvgArrowLeft, SvgCheckboxMarkedCircle, SvgClipboardListOutline, SvgCloseCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import { SeedWord } from './components/SeedWord';

export interface Props {
  seedPhrase?: string;
  onBack:() => void;
  onContinue: () => void;
}

enum status {
  pending,
  invalid,
  valid
}

export const ConfirmSeed: FC<Props> = ({ onBack, onContinue, seedPhrase }) => {
  const [constructedPhrase, setConstructedPhrase] = useState<string[]>([]);
  const [shuffledPhrase, setShuffledPhrase] = useState<string[]>([]);
  const [confirmationStatus, setConfirmationStatus] = useState<status>(status.pending);

  const shuffle = useCallback((a: string[]) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }, []);

  useEffect(() => {
    seedPhrase && setShuffledPhrase(shuffle(seedPhrase.split(' ')));
  }, [seedPhrase, shuffle]);

  useEffect(() => {
    if (constructedPhrase.length === 12) {
      if (constructedPhrase.join(' ') === seedPhrase) {
        setConfirmationStatus(status.valid);
      } else {
        setConfirmationStatus(status.invalid);
      }
    } else {
      setConfirmationStatus(status.pending);
    }
  }, [constructedPhrase, seedPhrase]);

  const resetPhrase = () => {
    seedPhrase && setShuffledPhrase(shuffle(seedPhrase.split(' ')));
    setConstructedPhrase([]);
  };

  const addSeedWord = (index: number) => () => {
    const word = shuffledPhrase[index];
    const tmp = [...shuffledPhrase];

    tmp.splice(index, 1);
    setShuffledPhrase(tmp);
    setConstructedPhrase([...constructedPhrase, word]);
  };

  const removeSeedWord = (index: number) => () => {
    const word = constructedPhrase[index];
    const tmp = [...constructedPhrase];

    tmp.splice(index, 1);
    setConstructedPhrase(tmp);
    setShuffledPhrase([...shuffledPhrase, word]);
  };

  const renderStatus = () => {
    const color = confirmationStatus === status.invalid ? 'alert' : 'success';
    const message = confirmationStatus === status.invalid ? 'Your recovery phrase is incorrect. Please try again.' : 'Your recovery phrase is correct. Thank you!';
    const icon = confirmationStatus === status.invalid ? SvgCloseCircle : SvgCheckboxMarkedCircle;

    return (
      <Flex alignItems='flex-start'
        mx='xs'>
        <Box>
          <Icon Asset={icon}
            color={color}
            height={15}
            width={15} />
        </Box>
        <Box ml='xs'>
          <Text color={color}
            variant='b2'>
            {message}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <Header headerText='Confirm your recovery phrase'
        iconAsset={SvgClipboardListOutline}>
      </Header>
      <Box pt='m'>
        <Text color='gray.1'
          variant='b2m'>
          Enter your 12–word recovery phrase
        </Text>
      </Box>
      <Flex alignItems='flex-start'
        backgroundColor={confirmationStatus === status.invalid ? 'red.1' : 'gray.0'}
        borderColor={confirmationStatus === status.valid ? 'success' : confirmationStatus === status.invalid ? 'alert' : 'gray.3'}
        borderRadius='1'
        borderStyle='solid'
        borderWidth={1}
        height={190}
        mx='s'
        p='xs'>
        {constructedPhrase.length === 0 &&
          <Text color='gray.3'
            variant='b2'>
            Click on each word below in the correct order to confirm your recovery phrase.
          </Text>
        }
        <Flex flexWrap='wrap'>
          {constructedPhrase.map((word, index) => (
            <Box key={index}
              mr='xs'
              onClick={removeSeedWord(index)}
              style={{ cursor: 'pointer' }}>
              <SeedWord seedWord={word}
                wordOrder={index} />
            </Box>
          ))}
        </Flex>
      </Flex>
      <Flex
        flexWrap='wrap'>
        {shuffledPhrase.map((word, index) => (
          <Box backgroundColor='gray.4'
            borderRadius='1'
            key={index}
            mr='s'
            mt='s'
            onClick={addSeedWord(index)}
            px='s'
            style={{ cursor: 'pointer' }}>
            <Text color='gray.1'
              variant='b2m'>{word}</Text>
          </Box>
        ))}
      </Flex>
      {confirmationStatus !== status.pending &&
        renderStatus()
      }
      {
        confirmationStatus === status.invalid &&
          <Box mt='s'>
            <ButtonSmall fluid
              onClick={resetPhrase}
              variant='secondary'>Reset the phrase</ButtonSmall>
          </Box>
      }
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mx='xs'>
        <Flex mb='s'>
          <Button minsize
            onClick={onBack}
            variant='secondary'>
            <Icon Asset={SvgArrowLeft}
              color='gray.1'
              height={16}
              width={16} />
          </Button>
          <Box ml='s'
            width={255}>
            <Button disabled={confirmationStatus !== status.valid}
              fluid
              onClick={onContinue}
              variant='secondary'>
              Continue
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
