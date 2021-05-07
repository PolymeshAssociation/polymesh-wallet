import { AccountForm, AccountInfo } from '@polymathnetwork/extension-ui/components/AccountForm';
import React, { FC, useContext, useState } from 'react';

import { ActionContext } from '../../components';
import { createAccountSuri } from '../../messaging';
import { EnterSeed } from './components/EnterSeed';

export const RestoreFromSeed: FC = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [step, setStep] = useState(0);
  const onAction = useContext(ActionContext);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    step > 0 && setStep(step - 1);
  };

  const importAccount = (accountInfo: AccountInfo) => {
    createAccountSuri(accountInfo.accountName, accountInfo.password, seedPhrase)
      .then(() => onAction('/'))
      .catch((error): void => {
        console.error(error);
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AccountForm
            headerText='Restore your account with your recovery phrase'
            noHeader={true}
            onBack={prevStep}
            onContinue={importAccount}
            submitText='Restore'
          />
        );
      default:
        return <EnterSeed onContinue={nextStep}
          setPhrase={setSeedPhrase} />;
    }
  };

  return renderStep();
};
