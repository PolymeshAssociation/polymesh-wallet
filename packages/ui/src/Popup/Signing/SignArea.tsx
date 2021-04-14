import { PASSWORD_EXPIRY_MIN } from '@polkadot/extension-base/defaults';
import { ActionContext } from '@polymathnetwork/extension-ui/components';
import { Box, Button, Checkbox, Flex } from '@polymathnetwork/extension-ui/ui';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { approveSignPassword, cancelSignRequest, isSignLocked } from '../../messaging';
import Unlock from './Unlock';

interface Props {
  buttonText: string;
  className?: string;
  error: string | null;
  isExternal?: boolean;
  isFirst: boolean;
  setError: (value: string | null) => void;
  signId: string;
  rejectOnly?: boolean;
}

function SignArea ({ buttonText, error, isExternal, isFirst, rejectOnly = false, setError, signId }: Props): JSX.Element {
  const [savePass, setSavePass] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const onAction = useContext(ActionContext);

  useEffect(() => {
    setIsLocked(null);
    let timeout: NodeJS.Timeout;

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

    return () => { !!timeout && clearTimeout(timeout); };
  }, [isExternal, signId]);

  const _onSign = useCallback(
    (): Promise<void> => {
      setIsBusy(true);

      return approveSignPassword(signId, savePass, password)
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
    (): Promise<void> => cancelSignRequest(signId)
      .then(() => onAction())
      .catch((error: Error) => console.error(error)),
    [onAction, signId]
  );

  const RememberPasswordCheckbox = () => (
    <Checkbox
      checked={savePass}
      label={ isLocked
        ? `Remember my password for the next ${PASSWORD_EXPIRY_MIN} minutes`
        : `Extend the period without password by ${PASSWORD_EXPIRY_MIN} minutes`
      }
      onChange={setSavePass}
    />
  );

  return (
    <>
      {isFirst && !isExternal && (
        <Flex flexDirection='column'
          p='s'>
          { isLocked && (
            <Unlock
              error={error}
              isBusy={isBusy}
              onSign={_onSign}
              password={password}
              setError={setError}
              setPassword={setPassword}
            />
          )}
          <Box mb='s'>
            <RememberPasswordCheckbox />
          </Box>
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
            { !rejectOnly && <Flex flex={1}
              ml='xs'>
              <Button
                busy={isBusy}
                disabled={(!!isLocked && !password) || !!error}
                fluid
                onClick={_onSign}
                type='submit'
              >
                {buttonText}
              </Button>
            </Flex> }
          </Flex>
        </Flex>
      )}

    </>
  );
}

export default SignArea;
