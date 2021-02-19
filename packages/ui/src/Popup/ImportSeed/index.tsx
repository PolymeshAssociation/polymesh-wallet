import { AccountDetails, AccountInfo } from '@polymathnetwork/extension-ui/components/AccountDetails';
import React, { FC, useContext, useState } from 'react';

import { ActionContext } from '../../components';
import { createAccountSuri } from '../../messaging';
import { EnterSeed } from './EnterSeed';

export const ImportSeed: FC = () => {
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
          <AccountDetails
            headerText='Restore your account with your recovery phrase'
            onBack={prevStep}
            onContinue={importAccount}
            submitText='Restore' />
        );
      default:
        return (
          <EnterSeed onContinue={nextStep}
            setPhrase={setSeedPhrase} />
        );
    }
  };

  return renderStep();
};
