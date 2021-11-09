import { NetworkName } from '../types';

export function initialFeatureState(): Record<NetworkName, unknown> {
  const state = Object.keys(NetworkName).reduce(function (acc, key) {
    acc[key as NetworkName] = {};

    return acc;
  }, {} as Record<NetworkName, unknown>);

  return state;
}
