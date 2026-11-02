import type { FC } from 'react';

import React, { useCallback } from 'react';

import { Flex } from '@polymeshassociation/extension-ui/ui';

import SignArea from './SignArea';

interface Props {
  signId: string;
}

// Shown when a request can't be decoded or rendered, so it can always be cancelled. Without this
// it stays queued, and the wallet shows it again every time it opens.
const UnreadableRequest: FC<Props> = ({ signId }) => {
  const setError = useCallback(() => undefined, []);

  return (
    <Flex
      flex={1}
      flexDirection='column'
      justifyContent='flex-end'
      width='100%'
    >
      <SignArea
        buttonText='Sign'
        error={null}
        rejectMessage='This request is malformed and cannot be signed. Cancel it and contact the site that sent it.'
        rejectOnly
        setError={setError}
        signId={signId}
      />
    </Flex>
  );
};

export default UnreadableRequest;
