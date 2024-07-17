import type { CSSObject, ThemedStyledProps } from 'styled-components';
import type { Theme } from '../types';

export type { StyledProps } from 'styled-components';

export type Style<P = Record<string, unknown>> = (
  props: ThemedStyledProps<P, Theme>
) => string | number;

export type Styles<P = Record<string, unknown>> = (
  props: ThemedStyledProps<P, Theme>
) => CSSObject;

export type Scale<TValue> = Record<string, TValue>;

export interface Breakpoints<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export type ResponsiveValue<T> = T | (T | null)[] | Breakpoints<T>;
