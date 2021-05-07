import { AccountForm, AccountInfo } from '@polymathnetwork/extension-ui/components/AccountForm';
import React, { FC, useContext, useEffect, useState } from 'react';

import { ActionContext } from '../../components';
import { createAccountSuri, createSeed } from '../../messaging';
import { ConfirmSeed } from './ConfirmSeed';
import { SeedView } from './SeedView';

export const NewAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const [step, setStep] = useState(0);

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, []);

  const createAccount = (accountInfo: AccountInfo) => {
    account && createAccountSuri(accountInfo.accountName, accountInfo.password, account.seed)
      .then((): void => onAction('/'))
      .catch((error: Error): void => {
        console.error(error);
      });
  };

  const nextStep = () => setStep(step + 1);

  const prevStep = () => {
    step > 0 && setStep(step - 1);
  };

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <SeedView onContinue={nextStep}
            seedPhrase={account?.seed} />
        );
      case 1:
        return (
          <ConfirmSeed onBack={prevStep}
            onContinue={nextStep}
            seedPhrase={account?.seed} />
        );
      case 2:
        return (
          <AccountForm
            headerText='Create and confirm your account name and wallet password'
            onBack={prevStep}
            onContinue={createAccount}
            submitText='Create account'/>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep(step)}
    </>
  );
};
