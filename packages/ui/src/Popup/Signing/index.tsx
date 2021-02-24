import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { getIdentifiedAccounts } from '@polymathnetwork/extension-core/store/getters';
import { Box, Header, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Loading, SigningReqContext } from '../../components';
import { AccountsHeader } from '../Accounts/AccountsHeader';
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
    setRequestIndex(
      (requestIndex) => requestIndex < requests.length
        ? requestIndex
        : requests.length - 1
    );
  }, [requests]);

  // protect against removal overflows/underflows
  const request = requests.length !== 0
    ? requestIndex >= 0
      ? requestIndex < requests.length
        ? requests[requestIndex]
        : requests[requests.length - 1]
      : requests[0]
    : null;

  // The singing account, whose details will be displayed in the header.
  const signingAccount = useMemo(() => {
    if (request && request?.account.address) {
      // Polkadot App actually respects chain ss58format and will encode polymesh public
      // keys into an address that starts with '2'. However, our stored addresses start with '5'.
      // Hence, we'll re-encode request address to make sure it could be found in our store.
      const address = encodeAddress(decodeAddress(request?.account.address));
      const polymeshAccount = getIdentifiedAccounts().find((account) => account.address === address);

      return polymeshAccount;
    }

    return undefined;
  }, [request]);

  return request
    ? (
      <>
        <Header>
          {signingAccount && <AccountsHeader account={signingAccount}
            details={false} />}
          <Box>
            <Text color='gray.0'
              variant='b2'>
              {requests.length > 1 && (
                <TransactionIndex
                  index={requestIndex}
                  onNextClick={_onNextClick}
                  onPreviousClick={_onPreviousClick}
                  totalItems={requests.length}
                />
              )}
            </Text>
          </Box>
        </Header>
        <Request
          account={request.account}
          isFirst={requestIndex === 0}
          request={request.request}
          signId={request.id}
          url={request.url}
        />
      </>
    )
    : <Loading />;
}
