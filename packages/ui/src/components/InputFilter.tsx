import { Icon, icons, TextInput } from '@polymathnetwork/polymesh-ui';
import React, { useCallback } from 'react';

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
        icon={<Icon Asset={icons.SvgSearch}
          height={17.5}
          width={17.5} />}
        onChange={onChangeFilter}
        placeholder={placeholder}
        spellCheck={false}
        type='text'
        value={value}
      />
    </div>
  );
}
