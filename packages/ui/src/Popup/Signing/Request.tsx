import { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import { TypeRegistry } from '@polkadot/types';
import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ActionContext, ActivityContext } from '../../components';
import { approveSignPassword, approveSignSignature, cancelSignRequest, isSignLocked } from '../../messaging';
import { Box, Button, Flex, Heading } from '../../ui';
import Bytes from './Bytes';
import Extrinsic from './Extrinsic';
import LedgerSign from './LedgerSign';
import Unlock from './Unlock';

interface Props {
  account: AccountJson;
  isFirst?: boolean;
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

export default function Request ({ account: { accountIndex, addressOffset, isExternal, isHardware },
  // buttonText,
  isFirst, request, signId, url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [{ hexBytes, payload }, setData] = useState<Data>({ hexBytes: null, payload: null });
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [savePass, setSavePass] = useState(false);
  const isBusy = useContext(ActivityContext);

  useEffect((): void => {
    setIsLocked(null);

    !isExternal && isSignLocked(signId)
      .then(({ isLocked }) => setIsLocked(isLocked))
      .catch((error: Error) => console.error(error));
  }, [isExternal, signId]);

  useEffect((): void => {
    const payload = request.payload;

    if (isRawPayload(payload)) {
      setData({
        hexBytes: payload.data,
        payload: null
      });
    } else {
      registry.setSignedExtensions(payload.signedExtensions);

      setData({
        hexBytes: null,
        payload: registry.createType('ExtrinsicPayload', payload, { version: payload.version })
      });
    }
  }, [request]);

  const _onCancel = useCallback(
    (): Promise<void> => cancelSignRequest(signId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [onAction, signId]
  );

  const _onSign = useCallback(
    (password: string): Promise<void> => {
      return approveSignPassword(signId, savePass, password)
        .then((): void => {
          onAction();
        })
        .catch((error: Error): void => {
          setError(error.message);
          console.error(error);
        });
    },
    [onAction, savePass, signId]
  );

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

  const _onSignQuick = useCallback(
    () => _onSign(''),
    [_onSign]
  );

  const content = () => {
    if (payload !== null) {
      const json = request.payload as SignerPayloadJSON;

      return (
        <>
          <Extrinsic
            request={json}
          />
          {isHardware && (
            <LedgerSign
              accountIndex={accountIndex as number || 0}
              addressOffset={addressOffset as number || 0}
              error={error}
              genesisHash={json.genesisHash}
              onSignature={_onSignature}
              payload={payload}
              setError={setError}
            />
          )}
        </>
      );
    } else if (hexBytes !== null) {
      const raw = request.payload as SignerPayloadRaw;

      return (
        <Bytes
          bytes={raw.data}
          url={url}
        />
      );
    }

    return null;
  };

  const signArea = isLocked
    ? (
      <Unlock
        error={error}
        isFirst={isFirst}
        isLocked={isLocked}
        onCancel={_onCancel}
        onSavePassChange={setSavePass}
        onSign={_onSign}
        savePass={!!savePass}
      />
    )
    : (
      <Flex
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'>
        <Box>
          <Flex>
            <Box>
              <Button
                fluid
                onClick={_onCancel}
                variant='secondary'>
                Reject
              </Button>
            </Box>
            {isFirst && <Box ml='xs'>
              <Button
                busy={isBusy}
                fluid
                onClick={_onSignQuick}
                type='submit'>
                Authorize
              </Button>
            </Box> }
          </Flex>
        </Box>
      </Flex>
    );

  return (
    <>
      <Box style={{ display: isFirst ? 'block' : 'none', overflowY: 'scroll', height: '100%', minWidth: '100%' }}>
        <Box mt='xs'
          mx='s'>
          <Heading variant='h5'>Signing Request</Heading>
        </Box>
        <ContentArea>

          {content()}
        </ContentArea>
      </Box>

      {signArea}
    </>
  );
}

const ContentArea = styled.div`
  height: 100%;
  overflow-y: scroll;
  margin-top: -25px;
  padding-top: 25px;
  padding-right: 0px;
  padding-left: 0px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
