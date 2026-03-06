import type { AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import type { PolymeshContext as PolymeshContextType } from '../types';
import type { AvailableThemes } from './themes';

import React from 'react';

import { defaultNetworkState } from '@polymeshassociation/extension-core/constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (): void => undefined;

const AccountContext = React.createContext<AccountsContext>({
  accounts: [],
  hierarchy: [],
  master: undefined
});
const ActionContext = React.createContext<(to?: string) => void>(noop);
const AuthorizeReqContext = React.createContext<AuthorizeRequest[]>([]);
const MediaContext = React.createContext<boolean>(false);
const MetadataReqContext = React.createContext<MetadataRequest[]>([]);
const SigningReqContext = React.createContext<SigningRequest[]>([]);
const ThemeSwitchContext =
  React.createContext<(theme: AvailableThemes) => void>(noop);
const ToastContext = React.createContext<{ show:((message: string) => void) }>({ show: noop });
const PolymeshContext = React.createContext<PolymeshContextType>({
  networkState: defaultNetworkState,
  polymeshAccounts: []
});
const ActivityContext = React.createContext<boolean>(false);

export { AccountContext,
  ActionContext,
  ActivityContext,
  AuthorizeReqContext,
  MediaContext,
  MetadataReqContext,
  PolymeshContext,
  SigningReqContext,
  ThemeSwitchContext,
  ToastContext };
