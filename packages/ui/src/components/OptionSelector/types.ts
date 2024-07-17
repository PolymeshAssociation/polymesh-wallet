import type React from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type OptionLabel = string | React.ReactElement;

export interface OptionItem {
  label: OptionLabel;
  value: any;
  icon?: React.ReactElement;
  disabled?: boolean;
}

export interface Option {
  category?: string;
  menu: OptionItem[];
  submenu?: React.ReactNode;
}

export type PositionType = 'context' | 'bottom-left' | 'bottom-right';

export interface CssPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Coordinates {
  x: number;
  y: number;
}
