import type { SignerPayloadJSON } from '@polkadot/types/types';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getIdentifiedAccounts } from '@polymeshassociation/extension-core/store/getters';
import { recodeAddress } from '@polymeshassociation/extension-core/utils';

import { Loading, SigningReqContext } from '../../components';
import { AccountMain } from '../Accounts/AccountMain';
import { AppHeader } from '../AppHeader';
import Request from './Request';
import TransactionIndex from './TransactionIndex';

export default function Signing (): React.ReactElement {
  const requests = useContext(SigningReqContext);
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
  // The singing account, whose details will be displayed in the header.
  const signingAccount = useMemo(() => {
    if (request?.account.address) {
      // Polkadot App actually respects chain ss58format and will encode polymesh public
      // keys into an address that starts with '2'. However, our stored addresses start with '5'.
      // Hence, we'll re-encode request address to make sure it could be found in our store.
      const _address = recodeAddress(request?.account.address);
      const polymeshAccount = getIdentifiedAccounts().find(
        (account) => account.address === _address
      );

      return polymeshAccount;
    }

    return undefined;
  }, [request]);

  return request
    ? (
      <>
        <AppHeader text={isTransaction ? 'Transaction' : 'Sign message'}>
          {requests.length > 1 && (
            <TransactionIndex
              index={requestIndex}
              onNextClick={_onNextClick}
              onPreviousClick={_onPreviousClick}
              totalItems={requests.length}
            />
          )}
          {signingAccount && (
            <AccountMain
              account={signingAccount}
              details={false}
            />
          )}
        </AppHeader>
        <Request
          account={request.account}
          buttonText={'Sign'}
          isFirst={requestIndex === 0}
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
