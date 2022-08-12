import {
  IdentifiedAccount,
  NetworkState,
} from '@polymathnetwork/extension-core/types';

import { Theme } from './components/themes';

export type { Theme };

export interface ThemeProps {
  theme: Theme;
}

export type PolymeshContext = {
  selectedAccount?: string;
  polymeshAccounts?: IdentifiedAccount[];
  networkState: NetworkState;
  currentAccount?: IdentifiedAccount;
};
