import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loading, SigningReqContext } from '../../components';
import Request from './Request';
import TransactionIndex from './TransactionIndex';
import { Box, Header, ScrollableContainer, Text } from '@polymathnetwork/extension-ui/ui';
import AccountsHeader from '../Accounts/AccountsHeader';
import { getIdentifiedAccounts } from '@polymathnetwork/extension-core/store/getters';

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
  const signingAccount = request &&
  getIdentifiedAccounts().find((account) => account.address === request?.account.address);

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
        <ScrollableContainer>
          <Request
            account={request.account}
            isFirst={requestIndex === 0}
            request={request.request}
            signId={request.id}
            url={request.url}
          />
        </ScrollableContainer>
      </>
    )
    : <Loading />;
}
