// Sort an array by prioritizing a certain element
function prioritize<P, T> (first: P, extractor: (a: T) => P) {
  return function (a: T, b: T): number {
    return first !== undefined ? extractor(a) === first ? -1 : 1 : 0;
  };
}

export {
  prioritize
};
