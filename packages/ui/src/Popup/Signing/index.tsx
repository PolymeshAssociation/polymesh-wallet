import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { recodeAddress } from '@polymeshassociation/extension-core/utils';

import { Loading, PolymeshContext, SigningReqContext } from '../../components';
import Request from './Request';
import SigningHeader from './SigningHeader';

function isRawPayload (
  payload: SignerPayloadJSON | SignerPayloadRaw
): payload is SignerPayloadRaw {
  return !!(payload as SignerPayloadRaw).data;
}

export default function Signing (): React.ReactElement {
  const requests = useContext(SigningReqContext);
  const { networkState, polymeshAccounts = [] } = useContext(PolymeshContext);
  const [requestIndex, setRequestIndex] = useState(0);

  const _onNextClick = useCallback(
    () => setRequestIndex((requestIndex) => requestIndex + 1),
    []
  );

  const _onPreviousClick = useCallback(
    () => setRequestIndex((requestIndex) => requestIndex - 1),
    []
  );

  useEffect(() => {
    setRequestIndex((requestIndex) =>
      requestIndex < requests.length ? requestIndex : requests.length - 1
    );
  }, [requests]);

  // protect against removal overflows/underflows
  const request =
    requests.length !== 0
      ? requestIndex >= 0
        ? requestIndex < requests.length
          ? requests[requestIndex]
          : requests[requests.length - 1]
        : requests[0]
      : null;
  const isTransaction = !!(request?.request?.payload as SignerPayloadJSON)
    ?.blockNumber;
  const requestPayload = request?.request.payload;
  const requestGenesisHash = useMemo(() => {
    if (!requestPayload || isRawPayload(requestPayload)) {
      return null;
    }

    return requestPayload.genesisHash;
  }, [requestPayload]);

  const isRequestChainSelected =
    !!requestGenesisHash &&
    !!networkState.genesisHash &&
    networkState.genesisHash === requestGenesisHash;

  // The signing account, whose details will be displayed in the header.
  const signingAccount = useMemo(() => {
    if (request?.account.address) {
      // Polkadot App actually respects chain ss58format and will encode polymesh public
      // keys into an address that starts with '2'. However, our stored addresses start with '5'.
      // Hence, we'll re-encode request address to make sure it could be found in our store.
      const _address = recodeAddress(request?.account.address);
      const polymeshAccount = polymeshAccounts.find(
        (account) => account.address === _address
      );

      return polymeshAccount;
    }

    return undefined;
  }, [polymeshAccounts, request]);

  const canShowBalance = !!signingAccount && !!requestGenesisHash && isRequestChainSelected;
  const displayAddress = request?.account.address;

  return request
    ? (
      <>
        <SigningHeader
          account={signingAccount}
          canShowBalance={canShowBalance}
          displayAddress={displayAddress}
          onNextClick={_onNextClick}
          onPreviousClick={_onPreviousClick}
          requestIndex={requestIndex}
          showBalanceSection={isTransaction}
          title={isTransaction ? 'Transaction' : 'Sign message'}
          totalRequests={requests.length}
        />
        <Request
          account={request.account}
          buttonText={'Sign'}
          request={request.request}
          signId={request.id}
          url={request.url}
        />
      </>
    )
    : (
      <Loading />
    );
}
