export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;
export type SecondArgumentType<T> = T extends (arg1: any, arg2: infer A) => any
  ? A
  : never;
export type FilterPropNamesByType<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

export type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;
export type GetSelectorReturnType<
  Selector extends (...args: any[]) => (...args: any[]) => any
> = ReturnType<ReturnType<Selector>>;
