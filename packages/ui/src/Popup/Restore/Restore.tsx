import { SvgAccountReactivate } from '@polymathnetwork/extension-ui/assets/images/icons';
import useIsPopup from '@polymathnetwork/extension-ui/hooks/useIsPopup';
import { windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { Box, Flex, Header, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router';

import { RestoreFromJson } from './RestoreFromJson';
import { RestoreFromSeed } from './RestoreFromSeed';

type RestoreMethod = 'seed' | 'json';

export const Restore: FC = () => {
  const history = useHistory();

  const { method } = useParams<{ method: RestoreMethod }>();

  const isPopup = useIsPopup();

  const shouldRestoreWithSeed = method === 'seed';
  const shouldRestoreWithJson = method === 'json';

  const restoreWithSeed = () => history.push('seed');
  const restoreWithJson = () => isPopup ? windowOpen('/account/restore/json') : history.push('json');

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
            onClick={restoreWithSeed}
            style={{ cursor: 'pointer' }}>
            <Text color={shouldRestoreWithSeed ? 'brandLighter' : 'white'}
              variant='b2m'>
              With recovery phrase
            </Text>
          </Flex>
          <Flex flex={1}
            justifyContent='center'
            onClick={restoreWithJson}
            style={{ cursor: 'pointer' }}>
            <Text color={shouldRestoreWithJson ? 'brandLighter' : 'white'}
              variant='b2m'>
              With JSON file
            </Text>
          </Flex>
        </Flex>
      </Header>
      {shouldRestoreWithSeed && <RestoreFromSeed />}
      {shouldRestoreWithJson && <RestoreFromJson />}
    </>
  );
};
