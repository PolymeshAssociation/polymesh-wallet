import React, { useContext } from 'react';

import { AccountContext, InputWithLabel, ValidatedInput } from '../components';
import { isNotShorterThan } from '../util/validators';

interface Props {
  address?: string;
  className?: string;
  isFocused?: boolean;
  label?: string;
  onBlur?: () => void;
  onChange: (name: string | null) => void;
}

const isNameValid = isNotShorterThan(3, 'Account name is too short');

export default function Name ({ address, className, isFocused, label = 'A descriptive name for your account', onBlur, onChange }: Props): React.ReactElement<Props> {
  const { accounts } = useContext(AccountContext);
  const account = accounts.find((account): boolean => account.address === address);
  const startValue = account && account.name;

  return (
    <ValidatedInput
      className={className}
      component={InputWithLabel}
      data-input-name
      defaultValue={startValue}
      isFocused={isFocused}
      label={label}
      onBlur={onBlur}
      onValidatedChange={onChange}
      type='text'
      validator={isNameValid}
    />
  );
}
