import { AccountJson, RequestSign } from '@polkadot/extension-base/background/types';
import { TypeRegistry } from '@polkadot/types';
import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { getIdentifiedAccounts } from '@polymathnetwork/extension-core/store/getters';
import { recodeAddress } from '@polymathnetwork/extension-core/utils';
import { Status, useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { Box, Button, Flex, Header, Heading } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { ActionContext, ActivityContext, Warning } from '../../components';
import { approveSignPassword, approveSignSignature, cancelSignRequest, isSignLocked } from '../../messaging';
import { AccountsHeader } from '../Accounts/AccountsHeader';
import { TroubleshootGuide } from '../ImportLedger/TroubleshootGuide';
import Bytes from './Bytes';
import Extrinsic from './Extrinsic';
import Unlock from './Unlock';

interface Props {
  account: AccountJson;
  isFirst?: boolean;
  request: RequestSign;
  signId: string;
  url: string;
}

interface Data {
  hexBytes: string | null;
  payload: ExtrinsicPayload | null;
}

// keep it global, we can and will re-use this across requests
const registry = new TypeRegistry();

function isRawPayload (payload: SignerPayloadJSON | SignerPayloadRaw): payload is SignerPayloadRaw {
  return !!(payload as SignerPayloadRaw).data;
}

export default function Request ({ account: { accountIndex, address, addressOffset, isExternal, isHardware },
  isFirst, request, signId, url }: Props): React.ReactElement<Props> | null {
  const onAction = useContext(ActionContext);
  const [{ hexBytes, payload }, setData] = useState<Data>({ hexBytes: null, payload: null });
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [savePass, setSavePass] = useState(false);
  const [isSigningLedger, setIsSigningLedger] = useState(false);
  const isBusy = useContext(ActivityContext);
  const { error: ledgerError, ledger, refresh, status: ledgerStatus } = useLedger(
    (request.payload as SignerPayloadJSON).genesisHash,
    accountIndex as number || 0,
    addressOffset as number || 0,
    !isHardware
  );

  useEffect((): void => {
    setIsLocked(null);

    !isExternal && isSignLocked(signId)
      .then(({ isLocked }) => setIsLocked(isLocked))
      .catch((error: Error) => console.error(error));
  }, [isExternal, signId]);

  useEffect((): void => {
    const payload = request.payload;

    if (isRawPayload(payload)) {
      setData({
        hexBytes: payload.data,
        payload: null
      });
    } else {
      registry.setSignedExtensions(payload.signedExtensions);

      setData({
        hexBytes: null,
        payload: registry.createType('ExtrinsicPayload', payload, { version: payload.version })
      });
    }
  }, [request]);

  useEffect(() => {
    if (isHardware && ledgerStatus === Status.Pending) {
      setWarning('An action is pending on your Ledger device.');
    } else if (isHardware && ledgerStatus === Status.Busy) {
      setWarning('Unable to connect to Ledger device. Please see if another Polymesh extension popup is open.');
    } else if (ledgerError && ledgerStatus === Status.Error) {
      setWarning(ledgerError);
    } else {
      setWarning(null);
    }
  }, [isHardware, ledgerStatus, ledgerError]);

  const _onCancel = useCallback(
    (): Promise<void> => cancelSignRequest(signId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [onAction, signId]
  );

  const _onSign = useCallback(
    (password: string): Promise<void> => {
      return approveSignPassword(signId, savePass, password)
        .then((): void => {
          onAction();
        })
        .catch((error: Error): void => {
          setError(error.message);
          console.error(error);
        });
    },
    [onAction, savePass, signId]
  );

  const _onSignature = useCallback(
    ({ signature }: { signature: string }): Promise<void> => {
      setIsSigningLedger(false);

      return approveSignSignature(signId, signature)
        .then(() => {
          onAction();
        })
        .catch((error: Error): void => {
          console.error(error);
          setError(error.message);
        });
    }
    ,
    [onAction, signId]
  );

  const _onSignLedger = useCallback(
    (): void => {
      if (!ledger || !payload) {
        return;
      }

      setError(null);
      setIsSigningLedger(true);

      const load = payload.toU8a(true);
      const index = accountIndex as number || 0;
      const offset = addressOffset as number || 0;

      ledger.sign(load, index, offset)
        .then(_onSignature)
        .catch((error: Error) => {
          console.error('ledger.sign error', error);
          setIsSigningLedger(false);

          if (error.message.includes('An action was already pending on the Ledger device')) {
            // Display the message without the verbose parts.
            setWarning('An action is pending on your Ledger device.');
          } else {
            setError(error.message);
          }
        });
    },
    [_onSignature, accountIndex, addressOffset, ledger, payload]
  );

  const _onSignQuick = useCallback(
    () => _onSign(''),
    [_onSign]
  );

  const content = () => {
    if (payload !== null) {
      const json = request.payload as SignerPayloadJSON;

      return (
        <Extrinsic
          request={json}
        />
      );
    } else if (hexBytes !== null) {
      const raw = request.payload as SignerPayloadRaw;

      return (
        <Bytes
          bytes={raw.data}
          url={url}
        />
      );
    }

    return null;
  };

  // The singing account, whose details will be displayed in the header.
  const signingAccount = useMemo(() => {
    if (address) {
      // Polkadot App actually respects chain ss58format and will encode polymesh public
      // keys into an address that starts with '2'. However, our stored addresses start with '5'.
      // Hence, we'll re-encode request address to make sure it could be found in our store.
      const _address = recodeAddress(address);
      const polymeshAccount = getIdentifiedAccounts().find((account) => account.address === _address);

      return polymeshAccount;
    }

    return undefined;
  }, [address]);

  console.log('Status', ledgerStatus);

  const signArea = isLocked && !isHardware
    ? (
      <Unlock
        error={error}
        isFirst={isFirst}
        isLocked={isLocked}
        onCancel={_onCancel}
        onSavePassChange={setSavePass}
        onSign={_onSign}
        savePass={!!savePass}
      />
    )
    : (
      <Flex flexDirection='column'
        p='s'>
        {error && (
          <Warning isDanger
            style={{ alignItems: 'center', alignSelf: 'flex-start', marginBottom: '10px' }}>
            {error}
          </Warning>
        )}
        {warning && (
          <Warning style={{ alignItems: 'center', alignSelf: 'flex-start', margin: '0 0 10px 0' }}>
            {warning}
          </Warning>
        )}
        <Flex alignItems='stretch'
          flexDirection='row'
          width='100%'>
          <Flex flex={1}>
            <Button
              fluid
              onClick={_onCancel}
              variant='secondary'>
              Reject
            </Button>
          </Flex >
          {isFirst && <Flex flex={1}
            ml='xs'>
            { isHardware && payload
              ? <Button
                busy={isBusy || isSigningLedger}
                disabled={ledgerStatus !== Status.Ok || hexBytes !== null}
                fluid
                onClick={_onSignLedger}
                style={{ alignSelf: 'stretch' }}
                type='submit'>
                Sign on Ledger
              </Button>
              : <Button
                busy={isBusy}
                fluid
                onClick={_onSignQuick}
                type='submit'>
                Sign
              </Button>
            }
          </Flex> }
        </Flex>
      </Flex>
    );

  if (isHardware && (ledgerStatus === Status.App || ledgerStatus === Status.Device)) {
    return (
      <Box p='s'>
        <TroubleshootGuide
          cancel={_onCancel}
          headerText='Please follow the instructions in order to sign on Ledger'
          ledgerStatus={ledgerStatus}
          refresh={refresh}/>
      </Box>
    );
  }

  return (
    <>
      {signingAccount &&
        <Header>
          <AccountsHeader account={signingAccount}
            details={false} />
        </Header>
      }
      <RequestContent isFirst={isFirst}>
        <Box mt='xs'
          mx='s'>
          <Heading variant='h5'>Signing Request</Heading>
        </Box>
        {content()}
      </RequestContent>

      {signArea}
    </>
  );
}

const RequestContent = styled.div<{ isFirst: boolean | undefined }>`
  display: ${({ isFirst }) => isFirst ? 'flex' : 'none'};
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  min-width: 100%;
`;
