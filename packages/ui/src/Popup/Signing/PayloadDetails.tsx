import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { formatNumber, hexToBn } from '@polkadot/util';
import React from 'react';

import { Box, ExpandableDetails, Flex, Text } from '@polymeshassociation/extension-ui/ui';

interface Props {
  payload: SignerPayloadJSON;
  payloadExt?: ExtrinsicPayload;
}

const PayloadDetails: React.FC<Props> = ({ payload, payloadExt }) => {
  // Extract lifetime information
  let lifetimeInfo = 'Unknown';

  if (payloadExt?.era) {
    const era = payloadExt.era;

    // Check if this is a mortal era using the Polkadot API type guard
    if (era.isMortalEra) {
      const mortal = era.asMortalEra;
      const blockNumber = payload.blockNumber || '0';
      const birthBlock = mortal.birth(blockNumber);
      const deathBlock = mortal.death(blockNumber);

      lifetimeInfo = `mortal, valid from #${birthBlock.toLocaleString()} to #${deathBlock.toLocaleString()}`;
    } else {
      lifetimeInfo = 'immortal';
    }
  }

  return (
    <ExpandableDetails title='Advanced Details'>
      <Box
        mt='m'
        mx='s'
      >
        <DetailRow
          label='Nonce'
          value={hexToBn(payload.nonce).toString()}
        />
        {!!payload.tip && !hexToBn(payload.tip).isZero() && (
          <DetailRow
            label='Tip'
            value={hexToBn(payload.tip).toString()}
          />
        )}
        <DetailRow
          label='Lifetime'
          value={lifetimeInfo}
        />
        {payload.blockNumber && (
          <DetailRow
            label='Block number'
            value={formatNumber(hexToBn(payload.blockNumber))}
          />
        )}
        <DetailRow
          label='Block hash'
          value={payload.blockHash}
        />
        <DetailRow
          label='Spec version'
          value={formatNumber(hexToBn(payload.specVersion))}
        />
        <DetailRow
          label='Transaction version'
          value={formatNumber(hexToBn(payload.transactionVersion))}
        />
        <DetailRow
          label='Extrinsic version'
          value={payload.version.toString()}
        />
        {payload.assetId && (
          <DetailRow
            label='Fee asset ID'
            value={payload.assetId}
          />
        )}
        {payload.metadataHash && (
          <DetailRow
            label='Metadata hash'
            value={payload.metadataHash}
          />
        )}
        <DetailRow
          label='Genesis hash'
          value={payload.genesisHash}
        />
      </Box>
    </ExpandableDetails>
  );
};

// Threshold: values longer than this many chars are stacked below the label
const STACK_THRESHOLD = 24;

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  const isLong = value.length > STACK_THRESHOLD;

  if (isLong) {
    return (
      <Box mb='xs'>
        <Text
          color='gray.2'
          variant='b3'
        >
          {label}
        </Text>
        <Text
          color='gray.1'
          style={{ display: 'block', wordBreak: 'break-all' }}
          variant='b3m'
        >
          {value}
        </Text>
      </Box>
    );
  }

  return (
    <Flex
      justifyContent='space-between'
      mb='xs'
    >
      <Text
        color='gray.2'
        variant='b3'
      >
        {label}
      </Text>
      <Text
        color='gray.1'
        variant='b3m'
      >
        {value}
      </Text>
    </Flex>
  );
};

export default PayloadDetails;
