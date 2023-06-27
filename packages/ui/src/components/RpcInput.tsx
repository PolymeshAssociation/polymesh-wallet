import { Icon, TextInput } from '@polymeshassociation/extension-ui/ui';
import React, { useCallback } from 'react';

import { SvgAccountNetwork } from '../assets/images/icons';

interface Props {
  className?: string;
  onChange: (customRPC: string) => void;
  placeholder: string;
  value: string;
}

export function RpcInput({
  className,
  onChange,
  placeholder,
  value,
}: Props): JSX.Element {
  const onChangeRpc = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <TextInput
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus
        icon={<Icon Asset={SvgAccountNetwork} height={17.5} width={17.5} />}
        onChange={onChangeRpc}
        placeholder={placeholder}
        spellCheck={false}
        type="text"
        value={value}
      />
    </div>
  );
}
