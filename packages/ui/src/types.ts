import type { IdentifiedAccount, NetworkState } from '@polymeshassociation/extension-core/types';
import type { Theme } from './components/themes';

export type { Theme };

export interface ThemeProps {
  theme: Theme;
}

export interface PolymeshContext {
  selectedAccount?: string;
  polymeshAccounts?: IdentifiedAccount[];
  networkState: NetworkState;
  currentAccount?: IdentifiedAccount;
}
