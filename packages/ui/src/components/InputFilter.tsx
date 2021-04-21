import React, { useCallback } from 'react';

import { TextInput } from '../ui';

interface Props {
  className?: string;
  onChange: (filter: string) => void;
  placeholder: string;
  value: string;
}

export function InputFilter ({ className, onChange, placeholder, value }: Props): JSX.Element {
  const onChangeFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <div className={className}>
      <TextInput
        autoCapitalize='off'
        autoCorrect='off'
        autoFocus
        onChange={onChangeFilter}
        placeholder={placeholder}
        spellCheck={false}
        type='text'
        value={value}
      />
    </div>
  );
}
