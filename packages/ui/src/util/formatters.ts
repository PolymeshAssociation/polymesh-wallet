import BigNumber from 'bignumber.js';

/**
 * Shortens an address for display purposes
 */
export const toShortAddress = (address: string, { size = 17 }: { size?: number } = {}) => {
  const minSize = 10;

  if (address.length <= minSize || address.length <= size) {
    return address;
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

export const truncateString = (str: string, size = 30): string => {
  if (str.length <= size) {
    return str;
  }

  return str.slice(0, size) + '...';
};
