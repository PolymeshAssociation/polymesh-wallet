import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import type { FC } from 'react';
import type { ResponsePolyCallDetails } from '@polymeshassociation/extension-core/background/types';

import React from 'react';

import { Box, ExpandableDetails, Text } from '@polymeshassociation/extension-ui/ui';

import PayloadDetails from './PayloadDetails';

interface MethodProps {
  call: ResponsePolyCallDetails;
  payload?: SignerPayloadJSON;
  payloadExt?: ExtrinsicPayload;
}

const Method: FC<MethodProps> = ({ call, payload, payloadExt }) => {
  const { args, meta, method, section } = call;

  const docLines = meta?.docs
    ?.map((d) => d.toString().trim())
    .filter((d) => d.length > 0) ?? [];

  return (
    <Box>
      <Box
        px='s'
        py='xs'
      >
        <Text
          as='div'
          color='gray.2'
          variant='b3m'
        >
          Method
        </Text>
        <Text
          as='div'
          color='gray.1'
          variant='code'
        >
          {`${section}: ${method}${meta ? `(${meta.args.map(({ name }) => name).join(', ')})` : ''}`}
        </Text>
      </Box>
      <ExpandableDetails title='Parameters'>
        <Box
          mt='xs'
          mx='s'
        >
          <Box style={{ overflowX: 'auto', width: '100%' }}>
            <Text
              color='gray.1'
              style={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              variant='code'
            >
              {JSON.stringify(args, null, 2).slice(1, -1).trim()}
            </Text>
          </Box>
        </Box>
      </ExpandableDetails>
      {docLines.length > 0 && (
        <ExpandableDetails title='Documentation'>
          <Box
            mt='xs'
            mx='s'
          >
            <Text
              color='gray.2'
              style={{ display: 'block', whiteSpace: 'pre-wrap' }}
              variant='b3'
            >
              {docLines.join(' ')}
            </Text>
          </Box>
        </ExpandableDetails>
      )}
      {payload && payloadExt && (
        <PayloadDetails
          payload={payload}
          payloadExt={payloadExt}
        />
      )}
    </Box>
  );
};

export default Method;
