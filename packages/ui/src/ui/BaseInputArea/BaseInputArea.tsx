import React, { FC, useCallback, useRef, useState } from 'react';

import { BaseInputAreaProps } from './BaseInputAreaProps';
import { Input, Wrapper } from './styles';

export const BaseInputArea: FC<BaseInputAreaProps> = (props) => {
  const {
    className,
    disabled,
    inputRef: inputRefFromProps,
    invalid,
    onBlur,
    onFocus,
    readOnly,
    ...restProps
  } = props;

  const inputRefInternal = useRef<HTMLTextAreaElement>(null);
  const inputRef = inputRefFromProps || inputRefInternal;

  const [focused, setFocusedState] = useState(false);
  const handleBlur = useCallback(
    (e) => {
      if (onBlur) onBlur(e);
      setFocusedState(false);
    },
    [onBlur, setFocusedState]
  );

  const handleFocus = useCallback(
    (e) => {
      if (onFocus) onFocus(e);
      setFocusedState(true);
    },
    [onFocus, setFocusedState]
  );

  return (
    <Wrapper {...{ focused, disabled, invalid, readOnly, className }}>
      <Input
        data-testid="base-input"
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        readOnly={readOnly}
        ref={inputRef}
        {...restProps}
      />
    </Wrapper>
  );
};
