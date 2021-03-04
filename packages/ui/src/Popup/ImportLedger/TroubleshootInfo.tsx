
import { Box } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

type Props = {
  error?: string | null;
};

export function TroubleshootInfo ({ error }: Props): React.ReactElement | null {
  if (!error) return null;

  console.log({ error });

  const isNoDeviceSelected = /no.*selected/ig.test(error);
  const hasRequestDeviceFailed = /failed.*requestDevice/ig.test(error);
  const isAppClosed = /not.*open/ig.test(error);

  console.log({ isNoDeviceSelected, isAppClosed, hasRequestDeviceFailed });

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
      return (
        <Box>
          Please install and open the Polymesh app on the Ledger device.
        </Box>
      );
  }

  return <Box>{error}</Box>;
}
