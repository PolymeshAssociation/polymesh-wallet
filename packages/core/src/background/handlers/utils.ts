import {
  assert,
  stringToHex,
} from '@polkadot/util';

export const stringToUnpadded = (input: string) => input.replace(/\0/g, '');

export const stringToPadded = (string: string, maxChars = 12) =>
  `${string}${'\u0000'.repeat(maxChars - string.length)}`;

export const stringToPaddedHex = (string: string) =>
  stringToHex(stringToPadded(string));

export const stripUrl = (url: string): string => {
  assert(
    url && (url.startsWith('http:') || url.startsWith('https:')),
    `Invalid url ${url}, expected to start with http: or https:`
  );

  const parts = url.split('/');

  return parts[2];
};
