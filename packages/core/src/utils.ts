import { messagePrefix } from './constants';

// Sort an array by prioritizing a certain element
function prioritize<P, T> (first: P, extractor: (a: T) => P) {
  return function (a: T, b: T): number {
    return first !== undefined ? extractor(a) === first ? -1 : 1 : 0;
  };
}

function isPolyMessage (message: string) {
  return message.indexOf(messagePrefix) === 0 ||
  message === 'pub(accounts.list)' ||
  message === 'pub(accounts.subscribe)';
}

export {
  prioritize,
  isPolyMessage
};
