/* eslint-disable camelcase */
/* eslint-disable quote-props */
/* eslint-disable quotes */

import { NetworkName, Schema } from '@polymathnetwork/extension-core/types';

import v4_0_0 from './v4.0.0';

const mainnet = v4_0_0;
const testnet = v4_0_0;
const staging = v4_0_0;
const local = v4_0_0;

const schemas: Record<NetworkName, Schema> = {
  mainnet,
  testnet,
  staging,
  local,
};

export default schemas;
