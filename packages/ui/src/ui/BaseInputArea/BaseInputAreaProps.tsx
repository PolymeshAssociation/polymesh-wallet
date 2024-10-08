import type { TextareaHTMLAttributes } from 'react';
import type React from 'react';

export interface BaseInputAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  height?: number;
  blurOnEnterKeyPress?: boolean;
}
