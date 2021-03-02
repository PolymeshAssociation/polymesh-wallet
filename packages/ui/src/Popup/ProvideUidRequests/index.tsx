import React, { useContext } from 'react';
import styled from 'styled-components';

import { ProvideUidReqContext } from '../../components';
import Request from './Request';

export default function ProvideUidRequests (): React.ReactElement {
  const requests = useContext(ProvideUidReqContext);

  return (
    <>
      <Scroll isLastRequest={requests.length === 1}>
        {requests.map(({ id, request, url }, index): React.ReactNode => (
          <Request
            isFirst={index === 0}
            key={id}
            reqId={id}
            request={request}
            url={url}
          />
        ))}
      </Scroll>
    </>
  );
}

const Scroll = styled.div<{isLastRequest: boolean}>`
  overflow-y: ${({ isLastRequest }): string => isLastRequest ? 'hidden' : 'auto'};
  height: 600px;
  && {
    padding: 0;
  }

  ${Request} {
    padding: 0 24px;
  }
`;
