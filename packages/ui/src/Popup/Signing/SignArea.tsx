import { PASSWORD_EXPIRY_MIN } from '@polkadot/extension-base/defaults';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ActionContext, Warning } from '@polymeshassociation/extension-ui/components';
import { Button, Checkbox, Flex, Text } from '@polymeshassociation/extension-ui/ui';

import { approveSignPassword, cancelSignRequest, isSignLocked } from '../../messaging';
import Unlock from './Unlock';

interface Props {
  buttonText: string;
  className?: string;
  error: string | null;
  footerExtra?: React.ReactNode;
  isExternal?: boolean;
  rejectMessage?: string;
  setError: (value: string | null) => void;
  signId: string;
  rejectOnly?: boolean;
  warningMessage?: string;
}

function SignArea ({ buttonText,
  error,
  footerExtra,
  isExternal,
  rejectMessage,
  rejectOnly = false,
  setError,
  signId,
  warningMessage }: Props): React.ReactElement {
  const [savePass, setSavePass] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const onAction = useContext(ActionContext);

  useEffect(() => {
    if (rejectOnly) {
      return;
    }

    setIsLocked(null);
    let timeout: ReturnType<typeof setTimeout>;

    !isExternal && isSignLocked(signId)
      .then(({ isLocked, remainingTime }) => {
        setIsLocked(isLocked);
        timeout = setTimeout(() => {
          setIsLocked(true);
        }, remainingTime);

        // if the account was unlocked check the remember me
        // automatically to prolong the unlock period
        !isLocked && setSavePass(true);
      })
      .catch((error: Error) => console.error(error));

    return () => {
      !!timeout && clearTimeout(timeout);
    };
  }, [isExternal, rejectOnly, signId]);

  const _onSign = useCallback(
    (): void => {
      setIsBusy(true);
      approveSignPassword(signId, savePass, password)
        .then((): void => {
          setIsBusy(false);
          onAction();
        })
        .catch((error: Error): void => {
          setIsBusy(false);
          setError(error.message);
          console.error(error);
        });
    },
    [onAction, password, savePass, setError, setIsBusy, signId]
  );

  const _onCancel = useCallback(
    (): void => {
      cancelSignRequest(signId)
        .then(() => onAction())
        .catch((error: Error) => console.error(error));
    },
    [onAction, signId]
  );

  const showRejectMessage = rejectOnly && !!rejectMessage;
  const canSignInWallet = !isExternal && !rejectOnly;
  const showUnlock = canSignInWallet && !!isLocked;
  const showSavePassword = canSignInWallet;

  return (
    <>
      <Flex
        flexDirection='column'
      >
        {footerExtra}
        {!!warningMessage && <Warning isDanger>{warningMessage}</Warning>}
        {showRejectMessage && <Warning>{rejectMessage}</Warning>}
        {showUnlock && (
          <Unlock
            error={error}
            isBusy={isBusy}
            onSign={_onSign}
            password={password}
            setError={setError}
            setPassword={setPassword}
          />
        )}
        {showSavePassword && (
          <Flex
            pl='15px'
            pr='s'
            pt='5px'
            width='100%'
          >
            <Checkbox
              checked={savePass}
              label={
                <Text variant='b3'>
                  {isLocked
                    ? `Remember my password for the next ${PASSWORD_EXPIRY_MIN} minutes`
                    : `Extend the period without password by ${PASSWORD_EXPIRY_MIN} minutes`}
                </Text>
              }
              onChange={setSavePass}
            />
          </Flex>
        )}
        <Flex
          alignItems='stretch'
          flexDirection='row'
          p='s'
          width='100%'
        >
          <Flex flex={1}>
            <Button
              fluid
              onClick={_onCancel}
              variant='secondary'
            >
              Cancel
            </Button>
          </Flex>
          {canSignInWallet && (
            <Flex
              flex={1}
              ml='xs'
            >
              <Button
                busy={isBusy}
                disabled={(!!isLocked && !password) || !!error}
                fluid
                onClick={_onSign}
                type='submit'
              >
                {buttonText}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default SignArea;
