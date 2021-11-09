import React, { useContext } from 'react';

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

export default function Name({
  address,
  className,
  onBlur,
  onChange,
  value,
}: Props): React.ReactElement<Props> {
  const { accounts } = useContext(AccountContext);

  const account = accounts.find((account) => account.address === address);
  const startValue = value || account?.name;

  return (
    <input
      className={className}
      data-input-name
      defaultValue={startValue}
      onBlur={onBlur}
      onChange={(event) => {
        const value = event.target.value;

        onChange(value);
      }}
      type="text"
    />
  );
}
