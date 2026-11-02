import type { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';

import { isExtrinsicRequest } from '@polkadot/extension-base/utils';
import { TypeRegistry } from '@polkadot/types';
import React, { useCallback, useContext, useMemo, useState } from 'react';
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

export default function Request ({ account: { accountIndex, addressOffset, isExternal, isHardware },
  buttonText,
  request,
  signId,
  url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [error, setError] = useState<string | null>(null);
  const [feeState, setFeeState] = useState<FeeState>({
    feeLoading: false,
    networkFee: '',
    protocolFee: ''
  });
  const [decodeState, setDecodeState] = useState<DecodeState>({});

  // Message or transaction follows the channel the request arrived on, never the payload fields,
  // which come from the dApp and can describe either shape. Decoding during render keeps the view
  // and the request in step; a failure throws to the error boundary in Signing, which offers Cancel.
  const payload = useMemo((): ExtrinsicPayload | null => {
    if (!isExtrinsicRequest(request)) {
      return null;
    }

    const json = request.payload;

    registry.setSignedExtensions(json.signedExtensions, polymeshSignedExtensions);

    return registry.createType('ExtrinsicPayload', json, {
      version: json.version
    });
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

  if (isExtrinsicRequest(request)) {
    const json = request.payload;

    if (payload === null) {
      return null;
    }

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
  } else {
    const raw = request.payload;
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
}

const RequestContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  width: 100%;
`;
