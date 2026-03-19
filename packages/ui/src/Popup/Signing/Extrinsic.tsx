import type { Call, ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';

import { Metadata } from '@polkadot/types';
import { hexToBn, hexToU8a } from '@polkadot/util';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { PolymeshContext } from '@polymeshassociation/extension-ui/components';
import { getPolyCallDetails } from '@polymeshassociation/extension-ui/messaging';
import { Box, ExpandableDetails, Text } from '@polymeshassociation/extension-ui/ui';

import useMetadata from '../../hooks/useMetadata';
import Method from './Method';
import NetworkInfo from './NetworkInfo';
import PayloadDetails from './PayloadDetails';

interface Props {
  onFeeStateChange?: (state: {
    feeLoading: boolean;
    feeNotice?: string;
    networkFee: string;
    protocolFee: string;
  }) => void;
  onWarningStateChange?: (warningMessage?: string) => void;
  request: SignerPayloadJSON;
  payloadExt?: ExtrinsicPayload;
}

interface DecodedCall {
  args: AnyJson;
  call: Call;
}

function Extrinsic ({ onFeeStateChange, onWarningStateChange, payloadExt, request }: Props): React.ReactElement<Props> {
  const { networkState } = useContext(PolymeshContext);
  const { chain, isLoading: isMetadataLoading } = useMetadata(request.genesisHash);
  const requestSpec = useMemo(() => hexToBn(request.specVersion), [request.specVersion]);
  const [networkFee, setNetworkFee] = useState('');
  const [protocolFee, setProtocolFee] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  const isRequestChainSelected =
    !!networkState.genesisHash &&
    networkState.genesisHash === request.genesisHash;

  const decodeResult = useMemo((): DecodedCall | null => {
    if (!chain) {
      return null;
    }

    const hasUsableMetadata = chain.hasMetadata || !!chain.definition.rawMetadata;

    if (!hasUsableMetadata) {
      return null;
    }

    if (!requestSpec.eqn(chain.specVersion)) {
      return null;
    }

    try {
      if (!chain.hasMetadata && chain.definition.rawMetadata) {
        chain.registry.setMetadata(
          new Metadata(chain.registry, hexToU8a(chain.definition.rawMetadata)),
          request.signedExtensions,
          chain.definition.userExtensions
        );
      }

      const call = chain.registry.createType('Call', request.method);
      const humanArgs = (call.toHuman() as { args: AnyJson }).args;

      return {
        args: humanArgs,
        call
      };
    } catch (error) {
      console.error('Error decoding transaction from metadata', error);

      return null;
    }
  }, [chain, request.method, request.signedExtensions, requestSpec]);

  const metadataAvailable = !!chain && (chain.hasMetadata || !!chain.definition.rawMetadata);
  const specMatches = !!chain && requestSpec.eqn(chain.specVersion);
  const networkName = chain?.name;

  useEffect(() => {
    setNetworkFee('');
    setProtocolFee('');
    setFeeError(null);

    if (!isRequestChainSelected) {
      setFeeLoading(false);

      return;
    }

    let cancelled = false;

    setFeeLoading(true);

    getPolyCallDetails(request)
      .then((details) => {
        if (cancelled) {
          return;
        }

        setNetworkFee(details.networkFee || '');
        setProtocolFee(details.protocolFee || '');
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        console.error('Failed to estimate transaction fee', error);
        setFeeError('Estimated transaction fee unavailable.');
      })
      .finally(() => {
        if (!cancelled) {
          setFeeLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isRequestChainSelected, request]);

  const feeNotice = !isRequestChainSelected
    ? 'Connect to the correct chain to estimate fees.'
    : feeError;

  useEffect(() => {
    onFeeStateChange?.({
      feeLoading,
      feeNotice: feeNotice || undefined,
      networkFee,
      protocolFee
    });
  }, [feeLoading, feeNotice, networkFee, onFeeStateChange, protocolFee]);

  useEffect(() => {
    const hasDecodeFailed = !isMetadataLoading && !decodeResult;

    onWarningStateChange?.(
      hasDecodeFailed
        ? 'Cannot decode transaction details. Connect the extension to the correct chain or review raw payload before signing.'
        : undefined
    );
  }, [decodeResult, isMetadataLoading, onWarningStateChange]);

  return (
    <>
      <NetworkInfo
        chainName={networkName}
        genesisHash={request.genesisHash}
        hasMetadata={metadataAvailable}
        hasSpecMatch={specMatches}
        isLoading={isMetadataLoading}
      />
      {decodeResult && (
        <Method
          call={{
            args: decodeResult.args,
            meta: decodeResult.call.meta,
            method: decodeResult.call.method,
            networkFee,
            protocolFee,
            section: decodeResult.call.section
          }}
          payload={request}
          payloadExt={payloadExt}
        />
      )}
      {!decodeResult && (
        <Box
          mb='m'
          mt='xs'
          mx='s'
        >
          <Box mt='xs'>
            <ExpandableDetails title='Raw SCALE Payload'>
              <Box
                mt='xs'
                mx='s'
              >
                <Text
                  color='gray.2'
                  variant='b3'
                >
                  Method bytes
                </Text>
                <Text
                  color='gray.1'
                  style={{ display: 'block', wordBreak: 'break-all' }}
                  variant='code'
                >
                  {request.method}
                </Text>
              </Box>
            </ExpandableDetails>
          </Box>
          <Box mt='xs'>
            <PayloadDetails
              payload={request}
              payloadExt={payloadExt}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default React.memo(Extrinsic);
