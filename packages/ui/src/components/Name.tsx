import React, { useContext, useMemo } from 'react';

import { TextInput } from '../ui';
import { isNotShorterThan } from '../util/validators';
import ValidatedInput from './ValidatedInput';
import { AccountContext } from './';

interface Props {
  address?: string;
  className?: string;
  isFocused?: boolean;
  label?: string;
  onBlur?: () => void;
  onChange: (name: string | null) => void;
  value?: string | null;
}

export default function Name ({ address, className, isFocused, label, onBlur, onChange, value }: Props): React.ReactElement<Props> {
  const { accounts } = useContext(AccountContext);
  const isNameValid = useMemo(() => isNotShorterThan(3, 'Account name is too short'), []);

  const account = accounts.find((account) => account.address === address);
  const startValue = value || account?.name;

  return (
    <input
      className={className}
      data-input-name
      defaultValue={startValue}
      // isFocused={isFocused}
      // label={label || 'A descriptive name for your account'}
      onBlur={onBlur}
      onChange={(event) => {
        const value = event.target.value;

        console.log('Value', value);
        onChange(value);
      }}
      // onEnter={onBlur}
      type='text'
      // validator={isNameValid}
    />
  );
}
