import { SvgAccountReactivate } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Header, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useState } from 'react';

import { RestoreFromJson } from './RestoreFromJson';
import { RestoreFromSeed } from './RestoreFromSeed';

export const Restore: FC = () => {
  const [currentMethod, setCurrentMethod] = useState<'JSON' | 'SEED'>('SEED');

  const setMethod = (method: 'SEED' | 'JSON') => () => setCurrentMethod(method);

  return (
    <>
      <Header headerText='Restore account'
        iconAsset={SvgAccountReactivate}>
        <Box pt='m'>
          <Text color='brandLightest'
            variant='b2'>
            Restore your Polymesh Account and/or key by entering your recovery phrase or uploading the JSON file and JSON password.
          </Text>
        </Box>
        <Flex mt='m'>
          <Flex flex={1}
            justifyContent='center'
            onClick={setMethod('SEED')}
            style={{ cursor: 'pointer' }}>
            <Text color={currentMethod === 'SEED' ? 'brandLighter' : 'white'}
              variant='b2m'>
              With recovery phrase
            </Text>
          </Flex>
          <Flex flex={1}
            justifyContent='center'
            onClick={setMethod('JSON')}
            style={{ cursor: 'pointer' }}>
            <Text color={currentMethod === 'JSON' ? 'brandLighter' : 'white'}
              variant='b2m'>
              With JSON file
            </Text>
          </Flex>
        </Flex>
      </Header>
      <Box>
        {/* @TODO use the outer Seed and Json components instead of these */}
        {currentMethod === 'SEED' && <RestoreFromSeed />}
        {currentMethod === 'JSON' && <RestoreFromJson />}
      </Box>
    </>
  );
};
