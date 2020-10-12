import { RequestAuthorizeTab } from '@polkadot/extension-base/background/types';
import { ThemeProps } from '../../types';

import React, { useCallback, useContext } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { Button, Box, Flex } from '../../ui';
import { ActionContext, PolymeshContext, Warning } from '../../components';
import useTranslation from '../../hooks/useTranslation';
import { approveAuthRequest, rejectAuthRequest } from '../../messaging';
import AccountsHeader from '../Accounts/AccountsHeader';
import { Header } from '@polymathnetwork/extension-ui/ui';

interface Props {
  authId: string;
  className?: string;
  isFirst: boolean;
  request: RequestAuthorizeTab;
  url: string;
}

function Request ({ authId, isFirst, request: { origin }, url }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const { currentAccount } = useContext(PolymeshContext);

  const _onApprove = useCallback(
    () => approveAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  const _onReject = useCallback(
    () => rejectAuthRequest(authId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [authId, onAction]
  );

  return (
    <>
      <Header>
        {currentAccount && <AccountsHeader account={currentAccount}
          details={false} />}
      </Header>
      <Info>
        <div className='tab-info'>
          <Trans key='accessRequest'>An application, self-identifying as <span className='tab-name'>{origin}</span> is requesting access from{' '}
            <a
              href={url}
              rel='noopener noreferrer'
              target='_blank'
            >
              <span className='tab-url'>{url}</span>
            </a>.
          </Trans>
        </div>
      </Info>
      <RequestWarning>{t<string>('Only approve this request if you trust the application. Approving gives the application access to the addresses of your accounts.')}</RequestWarning>

      <Flex flex={2}
        flexDirection='row'
        mb='s'
        mx='xs'>

        {isFirst && <Box>
          <Button
            fluid
            onClick={_onApprove}
            type='submit'>
            {t<string>('Authorize')}
          </Button>
        </Box> }
        <Box>
          <Button
            fluid
            onClick={_onReject}>
            {t<string>('Reject')}
          </Button>
        </Box>
      </Flex>
    </>
  );
}

const Info = styled.div`
  display: flex;
  flex-direction: row;
`;

const AcceptButton = styled(Button)`
  width: 90%;
  margin: 25px auto 0;
`;

const RequestWarning = styled(Warning)`
  margin: 24px 24px 0 1.45rem;
`;

AcceptButton.displayName = 'AcceptButton';

export default styled(Request)`

  .icon {
    background: ${({ theme }: ThemeProps): string => theme.buttonBackgroundDanger};
    color: white;
    min-width: 18px;
    width: 14px;
    height: 18px;
    font-size: 10px;
    line-height: 20px;
    margin: 16px 15px 0 1.35rem;
    font-weight: 800;
    padding-left: 0.5px;
  }

  .tab-info {
    overflow: hidden;
    margin: 0.75rem 20px 0 0;
  }

  .tab-name,
  .tab-url {
    color: ${({ theme }: ThemeProps): string => theme.textColor};
    display: inline-block;
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    cursor: pointer;
    text-decoration: underline;
  }
`;
