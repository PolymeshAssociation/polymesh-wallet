import {
  SvgAlertCircle,
  SvgFileLockOutline,
} from '@polymathnetwork/extension-ui/assets/images/icons';
import {
  Box,
  Button,
  Flex,
  Header,
  Icon,
  Text,
  TextInput,
} from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import {
  AccountContext,
  ActionContext,
  ActivityContext,
} from '../../components';
import { forgetAccount, validatePassword } from '../../messaging';

interface ParamTypes {
  address: string;
}

type PasswordForm = {
  currentPassword: string;
};

export const ForgetAccount: FC = () => {
  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const isBusy = useContext(ActivityContext);

  const { address } = useParams<ParamTypes>();

  const handleError = useErrorHandler();

  const { errors, handleSubmit, register, setError } = useForm<PasswordForm>();

  const account = accounts.find((_account) => _account.address === address);
  const isLedgerAccount =
    account?.isHardware && account.hardwareType === 'ledger';

  const performForgetAccount = async () => {
    await forgetAccount(address);

    onAction('/');
  };

  const onPasswordSubmit = async ({ currentPassword }: PasswordForm) => {
    try {
      const isValidPassword = await validatePassword(currentPassword);

      if (isValidPassword) {
        await performForgetAccount();
      } else {
        setError('currentPassword', { type: 'WrongPassword' });
      }
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <>
      <Header
        headerText="Forget account"
        iconAsset={SvgFileLockOutline}
      ></Header>
      <Flex alignItems="stretch" flexDirection="column" height="100%" p="s">
        <Box
          borderColor="gray.4"
          borderRadius={3}
          borderStyle="solid"
          borderWidth={2}
          p="s"
        >
          <Flex>
            <Icon Asset={SvgAlertCircle} color="alert" height={20} width={20} />
            <Box ml="s">
              <Text color="alert" variant="b3m">
                Attention
              </Text>
            </Box>
          </Flex>
          <Text color="gray.1" variant="b2m">
            You are about to remove this account. Once removed, this account
            will not be accessible via this extension unless you re-add it via
            JSON file or seed phrase.
          </Text>
        </Box>

        {!isLedgerAccount && (
          <form id="passwordForm" onSubmit={handleSubmit(onPasswordSubmit)}>
            <Box mt="m">
              <Box>
                <Text color="gray.1" variant="b2m">
                  Wallet password
                </Text>
              </Box>
              <Box>
                <TextInput
                  inputRef={register({ required: true, minLength: 8 })}
                  name="currentPassword"
                  placeholder="Enter your wallet password"
                  type="password"
                />
                {errors.currentPassword && (
                  <Box>
                    <Text color="alert" variant="b3">
                      {errors.currentPassword.type === 'required' &&
                        'Required field'}
                      {errors.currentPassword.type === 'minLength' &&
                        'Password too short'}
                      {errors.currentPassword.type === 'WrongPassword' &&
                        'Invalid password'}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </form>
        )}

        <Box mt="auto">
          {isLedgerAccount ? (
            <Button busy={isBusy} fluid onClick={performForgetAccount}>
              Forget account
            </Button>
          ) : (
            <Button busy={isBusy} fluid form="passwordForm" type="submit">
              Forget account
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};
