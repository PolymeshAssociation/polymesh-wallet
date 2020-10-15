import React, { FC, useContext, useEffect, useState } from 'react';
import { createAccountSuri, createSeed } from '../../messaging';
import { ActionContext, PolymeshContext } from '../../components';
import { AccountDetails } from './AccountDetails';
import { ConfirmSeed } from './ConfirmSeed';
import { SeedView } from './SeedView';

export const NewAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const { selectedAccount } = useContext(PolymeshContext);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const [step, setStep] = useState(0);
  const [credentials, setCredentials] = useState<{ name: string; password: string }>();

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, []);

  const createAccount = () => {
    credentials && account && createAccountSuri(credentials.name, credentials.password, account.seed)
      .then((): void => onAction('/'))
      .catch((error: Error): void => {
        console.error(error);
      });
  };

  const setAccountDetails = (name: string, password: string) => {
    setCredentials({ name, password });
  };

  const nextStep = () => {
    if (step === 2) {
      createAccount();
    } else {
      setStep(step + 1);
    }
  };

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
          <AccountDetails existingAccount={selectedAccount}
            onBack={prevStep}
            onContinue={nextStep}
            setAccountDetails={setAccountDetails} />
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
