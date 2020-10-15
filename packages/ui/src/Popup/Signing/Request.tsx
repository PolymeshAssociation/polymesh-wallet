import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import React, { useCallback, useContext, useState, useEffect } from 'react';
import { TypeRegistry } from '@polkadot/types';

import { ActionContext, ActivityContext } from '../../components';
import { Button } from '../../ui';

import { approveSignPassword, approveSignSignature, cancelSignRequest, isSignLocked } from '../../messaging';
import Bytes from './Bytes';
import Extrinsic from './Extrinsic';
import Qr from './Qr';
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

export default function Request ({ account: { isExternal }, isFirst, request, signId, url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [{ hexBytes, payload }, setData] = useState<Data>({ hexBytes: null, payload: null });
  const [error, setError] = useState<string | null>(null);
  // const [isBusy, setIsBusy] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [isSavedPass, setIsSavedPass] = useState(false);
  const isBusy = useContext(ActivityContext);

  useEffect((): void => {
    setIsLocked(null);

    !isExternal && isSignLocked(signId)
      .then((isLocked) => setIsLocked(isLocked))
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
      return approveSignPassword(signId, password, !!(password && isSavedPass))
        .then((): void => {
          onAction();
        })
        .catch((error: Error): void => {
          setError(error.message);
          console.error(error);
        });
    },
    [onAction, isSavedPass, signId]
  );

  const _onSignQuick = useCallback(
    () => _onSign(''),
    [_onSign]
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

  const content = () => {
    if (payload !== null) {
      const json = request.payload as SignerPayloadJSON;

      return isExternal
        ? (
          <Qr
            onSignature={_onSignature}
            payload={payload}
            request={json}
          />
        ) : (
          <Extrinsic
            request={json}
          />
        );
    } else if (hexBytes !== null) {
      const raw = request.payload as SignerPayloadRaw;

      return (
        <>
          <Bytes
            bytes={raw.data}
            url={url}
          />
        </>
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
        isSavedPass={!!isSavedPass}
        onCancel={_onCancel}
        onIsSavedPassChange={setIsSavedPass}
        onSign={_onSign}
      />
    )
    : (
      <Button busy={isBusy}
        disabled={isLocked === null}
        onClick={_onSignQuick}
      >
        Sign
      </Button>
    );

  return (
    <>
      {content()}
      {signArea}
    </>
  );
}
