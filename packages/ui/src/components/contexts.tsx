import { AccountsContext,
  AuthorizeRequest,
  MetadataRequest,
  SigningRequest } from '@polkadot/extension-base/background/types';
import settings from '@polkadot/ui-settings';
import { SettingsStruct } from '@polkadot/ui-settings/types';
import { ProofingRequest, ProvideUidRequest, ReadUidRequest } from '@polymathnetwork/extension-core/background/types';
import { defaultNetworkState } from '@polymathnetwork/extension-core/constants';
import { UidRecord } from '@polymathnetwork/extension-core/types';
import React from 'react';

import { PolymeshContext as PolymeshContextType } from '../types';
import { AvailableThemes } from './themes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (): void => undefined;

const AccountContext = React.createContext<AccountsContext>({ accounts: [], hierarchy: [], master: undefined });
const ActionContext = React.createContext<(to?: string) => void>(noop);
const AuthorizeReqContext = React.createContext<AuthorizeRequest[]>([]);
const MediaContext = React.createContext<boolean>(false);
const MetadataReqContext = React.createContext<MetadataRequest[]>([]);
const SettingsContext = React.createContext<SettingsStruct>(settings.get());
const SigningReqContext = React.createContext<SigningRequest[]>([]);
const ProofReqContext = React.createContext<ProofingRequest[]>([]);
const ProvideUidReqContext = React.createContext<ProvideUidRequest[]>([]);
const ReadUidReqContext = React.createContext<ReadUidRequest[]>([]);
const ThemeSwitchContext = React.createContext<(theme: AvailableThemes) => void>(noop);
const ToastContext = React.createContext<{ show:(message: string) => void }>({ show: noop });
const PolymeshContext = React.createContext<PolymeshContextType>({ networkState: defaultNetworkState, polymeshAccounts: [] });
const ActivityContext = React.createContext<boolean>(false);
const UidContext = React.createContext<UidRecord[] | null>([]);

export {
  AccountContext,
  ActionContext,
  ActivityContext,
  AuthorizeReqContext,
  MediaContext,
  MetadataReqContext,
  SettingsContext,
  SigningReqContext,
  ThemeSwitchContext,
  ToastContext,
  PolymeshContext,
  ProofReqContext,
  ProvideUidReqContext,
  UidContext,
  ReadUidReqContext
};
