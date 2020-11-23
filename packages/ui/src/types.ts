import { Theme } from './components/themes';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';

export { Theme };

export interface ThemeProps {
  theme: Theme;
}

export type PolymeshContext = {
  selectedAccount?: string;
  polymeshAccounts?: IdentifiedAccount[];
  network?: string;
  currentAccount?: IdentifiedAccount;
  isDeveloper?: boolean;
}
