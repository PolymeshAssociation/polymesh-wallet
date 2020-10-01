import React, { FC, useContext, useState } from 'react';
import { ActionContext, PolymeshContext } from '../../components';
import { AccountDetails, AccountInfo } from './AccountDetails';
import { createAccountSuri } from '../../messaging';
import { EnterSeed } from './EnterSeed';

export const ImportSeed: FC = () => {
  const { selectedAccount } = useContext(PolymeshContext);
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
      case 0:
      default:
        return (
          <EnterSeed onContinue={nextStep}
            setPhrase={setSeedPhrase} />
        );
      case 1:
        return (
          <AccountDetails existingAccount={selectedAccount || ''}
            onBack={prevStep}
            onContinue={importAccount} />
        );
    }
  };

  return renderStep();
};
