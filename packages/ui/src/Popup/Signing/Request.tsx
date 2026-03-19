import type { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import { TypeRegistry } from '@polkadot/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import polymeshSignedExtensions from '@polymeshassociation/polymesh-types/signedExtensions';

import { ActionContext } from '../../components';
import { approveSignSignature } from '../../messaging';
import Bytes from './Bytes';
import Extrinsic from './Extrinsic';
import FeeSummary from './FeeSummary';
import LedgerSignArea from './LedgerSignArea';
import SignArea from './SignArea';

interface Props {
  account: AccountJson;
  buttonText: string;
  request: RequestSign;
  signId: string;
  url: string;
}

interface Data {
  hexBytes: string | null;
  payload: ExtrinsicPayload | null;
}

interface FeeState {
  feeLoading: boolean;
  feeNotice?: string;
  networkFee: string;
  protocolFee: string;
}

interface DecodeState {
  warningMessage?: string;
}

// keep it global, we can and will re-use this across requests
const registry = new TypeRegistry();

function isRawPayload (
  payload: SignerPayloadJSON | SignerPayloadRaw
): payload is SignerPayloadRaw {
  return !!(payload as SignerPayloadRaw).data;
}

export default function Request ({ account: { accountIndex, addressOffset, isExternal, isHardware },
  buttonText,
  request,
  signId,
  url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [{ hexBytes, payload }, setData] = useState<Data>({
    hexBytes: null,
    payload: null
  });
  const [error, setError] = useState<string | null>(null);
  const [feeState, setFeeState] = useState<FeeState>({
    feeLoading: false,
    networkFee: '',
    protocolFee: ''
  });
  const [decodeState, setDecodeState] = useState<DecodeState>({});

  useEffect((): void => {
    const payload = request.payload;

    if (isRawPayload(payload)) {
      setData({
        hexBytes: payload.data,
        payload: null
      });
    } else {
      try {
        registry.setSignedExtensions(payload.signedExtensions, polymeshSignedExtensions);

        setData({
          hexBytes: null,
          payload: registry.createType('ExtrinsicPayload', payload, {
            version: payload.version
          })
        });
      } catch (error) {
        setError((error as Error).toString());
      }
    }
  }, [request]);

  const _onSignature = useCallback(
    ({ signature }: { signature: `0x${string}` }, signedTransaction?: `0x${string}`): void => {
      approveSignSignature(signId, signature, signedTransaction)
        .then(() => onAction())
        .catch((error: Error): void => {
          setError(error.message);
          console.error(error);
        });
    },
    [onAction, signId]
  );

  const _onWarningStateChange = useCallback((warningMessage?: string): void => {
    setDecodeState({ warningMessage });
  }, []);

  const externalRejectMessage = isExternal && !isHardware
    ? 'This external account cannot sign in the wallet.'
    : undefined;
  const shouldRejectOnly = !!externalRejectMessage;

  if (payload !== null) {
    const json = request.payload as SignerPayloadJSON;
    const footerExtra = (
      <FeeSummary
        feeLoading={feeState.feeLoading}
        feeNotice={feeState.feeNotice}
        networkFee={feeState.networkFee}
        protocolFee={feeState.protocolFee}
      />
    );

    if (isHardware) {
      return (
        <>
          <RequestContent>
            <Extrinsic
              onFeeStateChange={setFeeState}
              onWarningStateChange={_onWarningStateChange}
              payloadExt={payload}
              request={json}
            />
          </RequestContent>
          <LedgerSignArea
            accountIndex={(accountIndex) || 0}
            addressOffset={(addressOffset) || 0}
            error={error}
            footerExtra={footerExtra}
            genesisHash={json.genesisHash}
            onSignature={_onSignature}
            payloadExt={payload}
            payloadJson={json}
            setError={setError}
            signId={signId}
            warningMessage={decodeState.warningMessage}
          />
        </>
      );
    }

    return (
      <>
        <RequestContent>
          <Extrinsic
            onFeeStateChange={setFeeState}
            onWarningStateChange={_onWarningStateChange}
            payloadExt={payload}
            request={json}
          />
        </RequestContent>
        <SignArea
          buttonText={buttonText}
          error={error}
          footerExtra={footerExtra}
          isExternal={isExternal}
          rejectMessage={externalRejectMessage}
          rejectOnly={shouldRejectOnly}
          setError={setError}
          signId={signId}
          warningMessage={decodeState.warningMessage}
        />
      </>
    );
  } else if (hexBytes !== null) {
    const raw = request.payload as SignerPayloadRaw;
    const rejectMessage = isHardware
      ? 'Ledger devices do not support signing raw data.'
      : externalRejectMessage;

    return (
      <>
        <RequestContent>
          <Bytes
            bytes={raw.data}
            url={url}
          />
        </RequestContent>
        <SignArea
          buttonText={buttonText}
          error={error}
          isExternal={isExternal}
          rejectMessage={rejectMessage}
          rejectOnly={!!rejectMessage}
          setError={setError}
          signId={signId}
        />
      </>
    );
  }

  return null;
}

const RequestContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  width: 100%;
`;
