import type { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import { TypeRegistry } from '@polkadot/types';
import { Box, Heading } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ActionContext, VerticalSpace } from '../../components';
import { approveSignSignature } from '../../messaging';
import Bytes from './Bytes';
import Extrinsic from './Extrinsic';
import LedgerSignArea from './LedgerSignArea';
import SignArea from './SignArea';

interface Props {
  account: AccountJson;
  buttonText: string;
  isFirst: boolean;
  request: RequestSign;
  signId: string;
  url: string;
}

interface Data {
  hexBytes: string | null;
  payload: ExtrinsicPayload | null;
}

// keep it global, we can and will re-use this across requests
const registry = new TypeRegistry();

function isRawPayload (payload: SignerPayloadJSON | SignerPayloadRaw): payload is SignerPayloadRaw {
  return !!(payload as SignerPayloadRaw).data;
}

export default function Request ({ account: { accountIndex, address, addressOffset, isExternal, isHardware }, buttonText, isFirst, request, signId, url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [{ hexBytes, payload }, setData] = useState<Data>({ hexBytes: null, payload: null });
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    const payload = request.payload;

    if (isRawPayload(payload)) {
      setData({
        hexBytes: payload.data,
        payload: null
      });
    } else {
      try {
        registry.setSignedExtensions(payload.signedExtensions);

        setData({
          hexBytes: null,
          payload: registry.createType('ExtrinsicPayload', payload, { version: payload.version })
        });
      } catch (error) {
        setError((error as Error).toString());
      }
    }
  }, [request]);

  const _onSignature = useCallback(
    ({ signature }: { signature: string }): Promise<void> =>
      approveSignSignature(signId, signature)
        .then(() => onAction())
        .catch((error: Error): void => {
          setError(error.message);
          console.error(error);
        }),
    [onAction, signId]
  );

  // @TODO show an error
  if (isExternal && !isHardware) {
    return null;
  }

  if (payload !== null) {
    const json = request.payload as SignerPayloadJSON;

    return (
      <>
        <RequestContent isFirst={isFirst}>
          <Box mt='xs'
            mx='s'>
            <Heading variant='h5'>Signing Request</Heading>
          </Box>
          <Extrinsic
            request={json}
          />
        </RequestContent>
        {isHardware
          ? (
            <LedgerSignArea
              accountIndex={accountIndex as number || 0}
              addressOffset={addressOffset as number || 0}
              error={error}
              genesisHash={json.genesisHash}
              onSignature={_onSignature}
              payload={payload}
              setError={setError}
              signId={signId}
            />)
          : (
            <SignArea
              buttonText={buttonText}
              error={error}
              isExternal={isExternal}
              isFirst={isFirst}
              setError={setError}
              signId={signId}
            />
          )}
      </>
    );
  } else if (hexBytes !== null) {
    const raw = request.payload as SignerPayloadRaw;

    return (
      <>

        <Bytes
          bytes={raw.data}
          url={url}
        />
        <VerticalSpace />
        <SignArea
          buttonText={buttonText}
          error={error}
          isExternal={isExternal}
          isFirst={isFirst}
          rejectOnly={!!isHardware}
          setError={setError}
          signId={signId}
        />
      </>
    );
  }

  return null;
}

const RequestContent = styled.div<{ isFirst: boolean | undefined }>`
  display: ${({ isFirst }) => isFirst ? 'flex' : 'none'};
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  min-width: 100%;
`;
