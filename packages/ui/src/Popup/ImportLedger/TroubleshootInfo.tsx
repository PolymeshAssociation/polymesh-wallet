import { SvgInfo } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Button, Flex, Heading, Icon } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

type Props = {
  error?: string | null;
  refresh: () => void;
};

export function TroubleshootInfo ({ error, refresh }: Props): React.ReactElement | null {
  if (!error) return null;

  console.log({ error });

  const isNoDeviceSelected = /no.*selected/gi.test(error);
  const hasRequestDeviceFailed = /failed.*requestDevice/gi.test(error);
  const isAppClosed = /not.*open/gi.test(error);

  console.log({ isNoDeviceSelected, isAppClosed, hasRequestDeviceFailed });

  return (
    <Box>
      <Flex bg='yellow.1'
        borderRadius='50%'
        height={48}
        justifyContent='center'
        mb={16}
        width={48}>
        <Icon Asset={SvgInfo}
          color='yellow.0'
          height={20}
          width={20} />
      </Flex>
      <Heading variant='h5'>Your Ledger is not connected</Heading>
      <Box my={16}>
        <Button fluid
          onClick={refresh}
          variant='secondary'>
          Refresh
        </Button>
      </Box>
      {(() => {
        switch (true) {
          case isNoDeviceSelected || hasRequestDeviceFailed:
            return (
              <Box>
                Please ensure that:
                <ul>
                  <li>the device is connected</li>
                  <li>the device is unlocked</li>
                  <li>USB permission is granted in the browser</li>
                </ul>
              </Box>
            );
          case isAppClosed:
            return <Box>Please install and open the Polymesh app on the Ledger device.</Box>;
          default:
            return null;
        }
      })()}
    </Box>
  );
}
