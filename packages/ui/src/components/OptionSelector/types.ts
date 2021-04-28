/* eslint-disable @typescript-eslint/no-explicit-any */
export type OptionLabel = string | JSX.Element;

export type OptionItem = {
  label: OptionLabel;
  value: any;
};

export type Option = {
  category?: string;
  menu: OptionItem[];
};

export type PositionType = 'context' | 'bottom-left' | 'bottom-right';

export type CssPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type Coordinates = {
  x: number;
  y: number;
};
