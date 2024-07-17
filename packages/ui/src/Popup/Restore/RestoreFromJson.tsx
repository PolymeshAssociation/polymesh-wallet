import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { FC } from 'react';
import type { AccountInfo } from '@polymeshassociation/extension-ui/components/AccountForm';

import React, { useCallback, useContext, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import { AccountForm } from '@polymeshassociation/extension-ui/components/AccountForm';

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

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const prevStep = useCallback(() => {
    step > 0 && setStep(step - 1);
  }, [step]);

  const setJsonData = useCallback((
    accountJson: KeyringPair$Json,
    jsonPassword: string,
    accountName: string
  ) => {
    setAccountJson(accountJson);
    setJsonPassword(jsonPassword);
    setAccountName(accountName);
    nextStep();
  }, [nextStep]);

  const restoreAccount = useCallback((newAccountInfo: AccountInfo) => {
    if (accountJson?.address && jsonPassword) {
      (async () => {
        // Accounts should be visible by default.
        accountJson.meta.isHidden = undefined;
        accountJson.meta.name = newAccountInfo.accountName;

        await jsonRestore(accountJson, jsonPassword);
        // Change from the original JSON password to the password the user has just provided
        // by AccountForm.
        await changePassword(
          accountJson.address,
          jsonPassword,
          newAccountInfo.password
        );

        onAction('/');
      })().catch(errorHandler);
    } else {
      errorHandler(
        new Error('An unexpected error has occurred. Please try again.')
      );
    }
  }, [accountJson, errorHandler, jsonPassword, onAction]);

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
