import type { FC } from 'react';
import type { BaseInputProps } from './BaseInputProps';

import React, { useCallback, useRef, useState } from 'react';

import { Icon, Input, Unit, Wrapper } from './styles';

export const BaseInput: FC<BaseInputProps> = (props) => {
  const { blurOnEnterKeyPress,
    className,
    disabled,
    icon,
    inputRef: inputRefFromProps,
    invalid,
    onBlur,
    onFocus,
    readOnly,
    unit,
    ...restProps } = props;

  const inputRefInternal = useRef<HTMLInputElement>(null);
  const inputRef = inputRefFromProps || inputRefInternal;

  const [focused, setFocusedState] = useState(false);
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e);
      }

      setFocusedState(false);
    },
    [onBlur, setFocusedState]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }

      setFocusedState(true);
    },
    [onFocus, setFocusedState]
  );

  const handleKeyPress = useCallback(() => blurOnEnterKeyPress
    ? (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        if (typeof inputRef === 'object' && inputRef?.current) {
          inputRef.current.blur();
        }
      }
    }
    : undefined, [blurOnEnterKeyPress, inputRef]);

  return (
    <Wrapper {...{ className, disabled, focused, invalid, readOnly }}>
      {icon && <Icon>{icon}</Icon>}
      <Input
        data-testid='base-input'
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        readOnly={readOnly}
        ref={inputRef}
        {...restProps}
      />
      {unit && <Unit>{unit}</Unit>}
    </Wrapper>
  );
};
