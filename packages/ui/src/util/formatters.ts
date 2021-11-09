import BN from 'bn.js';

/**
 * Shortens an address for display purposes
 */
export const toShortAddress = (
  address: string,
  { size = 17 }: { size?: number } = {}
): string => {
  const minSize = 10;

  if (address.length <= minSize || address.length <= size) {
    return address;
  }

  const portionSize = Math.floor((size - 3) / 2);
  const remainder = ((size - 3) / 2) % 1 !== 0 ? 1 : 0;

  return `${address.substring(0, portionSize + remainder)}...${address.slice(
    -portionSize
  )}`;
};

export const formatAmount = (
  amount: BN | string | number,
  decimals = 6,
  minDigitsAfterDecimal = 3
): string => {
  amount = new BN(amount);

  const decimalsBN = new BN(decimals);
  const divisor = new BN(10).pow(decimalsBN);

  const beforeDecimal = amount
    .div(divisor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Thousands separator;
  const afterDecimal = '0'
    .repeat(decimals - amount.mod(divisor).toString().length) // Zero padding
    .concat(amount.mod(divisor).toString())
    .slice(0, minDigitsAfterDecimal); // trimming

  return `${beforeDecimal}.${afterDecimal}`;
};

export const truncateString = (str: string, size = 30): string => {
  if (str.length <= size) {
    return str;
  }

  return str.slice(0, size) + '...';
};
