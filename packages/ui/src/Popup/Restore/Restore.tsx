import type { FC } from 'react';

import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router';

import { SvgAccountReactivate } from '@polymeshassociation/extension-ui/assets/images/icons';
import useIsPopup from '@polymeshassociation/extension-ui/hooks/useIsPopup';
import { windowOpen } from '@polymeshassociation/extension-ui/messaging';
import { Box, Flex, Header, Text } from '@polymeshassociation/extension-ui/ui';

import { RestoreFromJson } from './RestoreFromJson';
import { RestoreFromSeed } from './RestoreFromSeed';

type RestoreMethod = 'seed' | 'json';

export const Restore: FC = () => {
  const history = useHistory();

  const { method } = useParams<{ method: RestoreMethod }>();

  const isPopup = useIsPopup();

  const shouldRestoreWithSeed = method === 'seed';
  const shouldRestoreWithJson = method === 'json';

  const restoreWithSeed = useCallback(() => history.push('seed'), [history]);
  const restoreWithJson = useCallback(() =>
    isPopup ? windowOpen('/account/restore/json') : history.push('json'), [history, isPopup]);

  return (
    <>
      <Header
        headerText='Restore account'
        iconAsset={SvgAccountReactivate}
      >
        <Box pt='m'>
          <Text
            color='brandLightest'
            variant='b2'
          >
            Restore your Polymesh Account and/or key by entering your recovery
            phrase or uploading the JSON file and JSON password.
          </Text>
        </Box>
        <Flex mt='m'>
          <Flex
            flex={1}
            justifyContent='center'
            onClick={restoreWithSeed}
            style={{ cursor: 'pointer' }}
          >
            <Text
              color={shouldRestoreWithSeed ? 'brandLighter' : 'white'}
              variant='b2m'
            >
              With recovery phrase
            </Text>
          </Flex>
          <Flex
            flex={1}
            justifyContent='center'
            onClick={restoreWithJson}
            style={{ cursor: 'pointer' }}
          >
            <Text
              color={shouldRestoreWithJson ? 'brandLighter' : 'white'}
              variant='b2m'
            >
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
