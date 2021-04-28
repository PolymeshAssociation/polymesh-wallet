import type { ThemeProps } from '../types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

interface Props extends ThemeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  uncheckedLabel: string;
  checkedLabel: string;
  className?: string;
}

function Switch ({ checked, checkedLabel, className, onChange, uncheckedLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked),
    [onChange]
  );

  return (
    <div className={className}>
      <label>
        <input
          checked={checked}
          className='checkbox'
          onChange={_onChange}
          type='checkbox'
        />
        <span className='slider'
        />
      </label>
      <span style={{ width: 40 }}>{checked ? checkedLabel : uncheckedLabel}</span>
    </div>
  );
}

export default styled(Switch)(({ checked, theme }: Props) => `
  display: flex;
  align-items: center;

  label {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
    margin: 8px;
  }

  .checkbox {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider:before {
      transform: translateX(24px);
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${checked ? theme.colors.success : theme.colors.gray[3]};
    transition: 0.2s;
    border-radius: 100px;
    border: 1px solid ${theme.inputBorderColor};

    &:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 3px;
      background-color: ${theme.colors.white};
      transition: 0.4s;
      border-radius: 12px;
    }
  }
`);
