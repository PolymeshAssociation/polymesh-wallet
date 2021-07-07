import { styled } from '@polymathnetwork/polymesh-ui';
import React, { useContext } from 'react';

import { ProvideUidReqContext } from '../../components';
import Request from './Request';

export default function ProvideUidRequests (): React.ReactElement {
  const requests = useContext(ProvideUidReqContext);

  return (
    <Container>
      {requests.map(({ id, request, url }, index): React.ReactNode => (
        <Request
          isFirst={index === 0}
          key={id}
          reqId={id}
          request={request}
          url={url}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  overflow-y: auto;
  height: 600px;

  && {
    padding: 0;
  }

  ${Request} {
    padding: 0 24px;
  }
`;
