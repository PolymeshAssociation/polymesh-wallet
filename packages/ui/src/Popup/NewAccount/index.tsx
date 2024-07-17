import type { FC } from 'react';
import type { AccountInfo } from '@polymeshassociation/extension-ui/components/AccountForm';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AccountForm } from '@polymeshassociation/extension-ui/components/AccountForm';

import { ActionContext } from '../../components';
import { createAccountSuri, createSeed } from '../../messaging';
import { ConfirmSeed } from './ConfirmSeed';
import { SeedView } from './SeedView';

export const NewAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const [account, setAccount] = useState<null | {
    address: string;
    seed: string;
  }>(null);
  const [step, setStep] = useState(0);

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, []);

  const createAccount = useCallback((accountInfo: AccountInfo) => {
    account &&
      createAccountSuri(
        accountInfo.accountName,
        accountInfo.password,
        account.seed
      )
        .then((): void => onAction('/'))
        .catch((error: Error): void => {
          console.error(error);
        });
  }, [account, onAction]);

  const nextStep = useCallback(() => setStep(step + 1), [step]);

  const prevStep = useCallback(() => {
    step > 0 && setStep(step - 1);
  }, [step]);

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <SeedView
            onContinue={nextStep}
            seedPhrase={account?.seed}
          />
        );
      case 1:
        return (
          <ConfirmSeed
            onBack={prevStep}
            onContinue={nextStep}
            seedPhrase={account?.seed}
          />
        );
      case 2:
        return (
          <AccountForm
            headerText='Create and confirm your account name and wallet password'
            onBack={prevStep}
            onContinue={createAccount}
            submitText='Create account'
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep(step)}</>;
};
