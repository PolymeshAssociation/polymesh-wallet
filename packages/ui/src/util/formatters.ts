import BigNumber from 'bignumber.js';

/**
 * Shortens an address for display purposes
 */
export const toShortAddress = (address: string, { size = 17 }: { size?: number } = {}) => {
  const minSize = 5;

  if (size < minSize) {
    throw new Error('Cannot shortify an address to less than 5 characters');
  }

  const portionSize = Math.floor((size - 3) / 2);
  const remainder = ((size - 3) / 2) % 1 !== 0 ? 1 : 0;

  return `${address.substring(0, portionSize + remainder)}...${address.slice(-portionSize)}`;
};

export const formatAmount = (amount: BigNumber, minimumFractionDigits = 0, scaleDown = false) => {
  const formattter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits
  });

  return formattter.format(parseFloat((scaleDown ? amount.div(1000000) : amount).toString()));
};
