import type { ThemeProps } from '../types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import arrow from '../assets/arrow-down.svg';
import Label from './Label';

interface DropdownOption {
  text: string;
  value: string;
}

interface Props extends ThemeProps {
  className?: string;
  defaultValue?: string | null;
  isDisabled?: boolean;
  isError?: boolean;
  isFocussed?: boolean;
  label: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  value?: string;
}

function Dropdown ({ className,
  defaultValue,
  isDisabled,
  isFocussed,
  label,
  onBlur,
  onChange,
  options,
  value }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(({ target: { value } }: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange && onChange(value.trim());
  }, [onChange]);

  return (
    <>
      <Label
        className={className}
        label={label}
      >
        <select
          autoFocus={isFocussed}
          defaultValue={defaultValue || undefined}
          disabled={isDisabled}
          onBlur={onBlur}
          onChange={_onChange}
          value={value}
        >
          {options.map(
            ({ text, value }): React.ReactNode => (
              <option
                key={value}
                value={value}
              >
                {text}
              </option>
            )
          )}
        </select>
      </Label>
    </>
  );
}

export default React.memo(
  styled(Dropdown)(
    ({ isError, label, theme }: Props) => `
  position: relative;

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: ${theme.readonlyInputBackground};
    border-color: ${isError ? theme.errorBorderColor : theme.colors.gray5};
    border-radius: ${theme.radii[3]};
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    color: ${isError ? theme.errorBorderColor : theme.textColor};
    display: block;
    font-family: ${theme.texts.b2.fontFamily};
    font-size: ${theme.texts.b2.fontSize};
    font-weight: ${theme.texts.b2.fontWeight};
    line-height: ${theme.texts.b2.lineHeight};
    padding: 0.5rem 0.75rem;
    width: 100%;
    cursor: pointer;

    &:read-only {
      box-shadow: none;
      outline: none;
    }
  }

  label::after {
    content: '';
    position: absolute;
    top: ${label ? 'calc(50% + 14px)' : '50%'};
    transform: translateY(-50%);
    right: 12px;
    width: 8px;
    height: 6px;
    background: url(${arrow}) center no-repeat;
    pointer-events: none;
  }
`
  )
);
