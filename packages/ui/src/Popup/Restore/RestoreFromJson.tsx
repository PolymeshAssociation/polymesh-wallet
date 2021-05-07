import { KeyringPair$Json } from '@polkadot/keyring/types';
import { AccountForm, AccountInfo } from '@polymathnetwork/extension-ui/components/AccountForm';
import React, { FC, useContext, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import { ActionContext } from '../../components';
import { changePassword, jsonRestore } from '../../messaging';
import { UploadJson } from './components/UploadJson';

export const RestoreFromJson: FC = () => {
  const [accountJson, setAccountJson] = useState<KeyringPair$Json>();
  const [jsonPassword, setJsonPassword] = useState<string>();
  const [accountName, setAccountName] = useState<string>();
  const [step, setStep] = useState(0);
  const onAction = useContext(ActionContext);
  const errorHandler = useErrorHandler();

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    step > 0 && setStep(step - 1);
  };

  const setJsonData = (accountJson: KeyringPair$Json, jsonPassword: string, accountName: string) => {
    setAccountJson(accountJson);
    setJsonPassword(jsonPassword);
    setAccountName(accountName);
    nextStep();
  };

  const restoreAccount = async (newAccountInfo: AccountInfo) => {
    if (accountJson && accountJson.address && jsonPassword) {
      try {
        // Accounts should be visible by default.
        accountJson.meta.isHidden = undefined;
        accountJson.meta.name = newAccountInfo.accountName;

        await jsonRestore(accountJson, jsonPassword);

        // Change from the original JSON password, to the password user has just provided
        // by AccountForm.
        await changePassword(accountJson.address, jsonPassword, newAccountInfo.password);

        onAction('/');
      } catch (error) {
        errorHandler(error);
      }
    } else {
      errorHandler(new Error('An unexpected error has occurred. Please try again.'));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AccountForm
            defaultName={accountName}
            headerText='Import account using JSON file'
            noHeader={true}
            onBack={prevStep}
            onContinue={restoreAccount}
            submitText='Import'
          />
        );
      default:
        return <UploadJson onContinue={setJsonData} />;
    }
  };

  return renderStep();
};
