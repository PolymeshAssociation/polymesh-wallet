import { AccountJson } from '@polkadot/extension-base/background/types';

function childrenCount (accounts: AccountJson[], parentAddress: string): number {
  return accounts.filter((account) => account.parentAddress === parentAddress).length;
}

export const nextDerivationPath = (accounts: AccountJson[], parentAddress: string): string => {
  const siblingsCount = childrenCount(accounts, parentAddress);

  return `//${siblingsCount}`;
};
