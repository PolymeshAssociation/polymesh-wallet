import { InputHTMLAttributes } from 'react';

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  unit?: React.ReactNode;
  icon?: React.ReactNode;
  invalid?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  blurOnEnterKeyPress?: boolean;
}
