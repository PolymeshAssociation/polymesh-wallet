import React, { useContext } from 'react';
import styled from 'styled-components';

import { ReadUidReqContext } from '../../components';
import Request from './Request';

export default function ProvideUidRequests (): React.ReactElement {
  const requests = useContext(ReadUidReqContext);

  return (
    <Container>
      {requests.map(({ id, url }, index): React.ReactNode => (
        <Request
          isFirst={index === 0}
          key={id}
          reqId={id}
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
