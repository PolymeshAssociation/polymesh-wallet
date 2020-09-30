// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProps as Props } from '../types';

import React, { useContext, useState } from 'react';

import { ActionContext } from '../components';
import { Button, Box, Checkbox, Text, Header, Heading, Icon, ScrollableContainer } from '../ui';
import { SvgPolyNew } from '../assets/images/icons';

export default function Welcome (): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);

  const [isPPChecked, setIsPPChecked] = useState<boolean>(false);
  const [isTSChecked, setIsTSChecked] = useState<boolean>(false);

  const _onClick = (): void => {
    window.localStorage.setItem('welcome_read', 'ok');
    onAction();
  };

  return (
    <ScrollableContainer>
      <Header>
        <Box mt='m'
          pb='m'>
          <Box
            backgroundColor='brandLightest'
            border='solid'
            borderColor='white'
            borderRadius='50%'
            borderWidth={4}
            height={80}
            padding={13}
            width={80}
          >
            <Icon Asset={SvgPolyNew}
              color='brandMain'
              height={50}
              width={50} />
          </Box>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h4'>
              Welcome to the Polymesh Wallet!
            </Heading>
          </Box>
        </Box>
      </Header>
      <Box mt='m'
        mx='s'>
        <Box>
          <Text color='gray.1'>A couple of things to note before we begin:</Text>
        </Box>
        <Box m='s'>
          <Box>
            <li>
              <Text color='gray.1'>We do not collect keys and passwords in our servers.</Text>
            </li>
            <li>
              <Text color='gray.1'>
                This wallet does not use any trackers or analytics; however, some applications you connect the wallet to
                may use trackers or analytics.
              </Text>
            </li>
            <li>
              <Text color='gray.1'>
                Please read our{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Privacy Policy
                </a>{' '}
                to see what information we do collect and how it is processed.
              </Text>
            </li>
          </Box>
        </Box>
        <Box m='s'>
          <Checkbox
            checked={isPPChecked}
            label={
              <Text color='gray.1'
                fontSize='0'>
                I have read and accept the Polymath{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Privacy Policy
                </a>
              </Text>
            }
            onClick={() => setIsPPChecked(!isPPChecked)}
          />
          <Checkbox
            checked={isTSChecked}
            label={
              <Text color='gray.1'
                fontSize='0'>
                I have read and accept the Polymath{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/wallet-terms'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Terms of Service
                </a>
              </Text>
            }
            onClick={() => setIsTSChecked(!isTSChecked)}
          />
        </Box>
      </Box>
      <Box mb='m'
        mt='l'
        mx='s'>
        <Button disabled={!isPPChecked || !isTSChecked}
          fluid
          onClick={_onClick}>
          Continue
        </Button>
      </Box>
    </ScrollableContainer>
  );
}
