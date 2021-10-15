/* eslint-disable camelcase */
/* eslint-disable quote-props */
/* eslint-disable quotes */

import { NetworkName, Schema } from '@polymathnetwork/extension-core/types';

import v3_2_0 from './v3.2.0';
import v3_3_0 from './v3.3.0';

const itn = v3_2_0;
const testnet = v3_2_0;
const alcyone = v3_2_0;
const pmf = v3_2_0;
const pme = v3_3_0;
const local = v3_3_0;

const schemas: Record<NetworkName, Schema> = {
  itn,
  testnet,
  alcyone,
  pmf,
  pme,
  local
};

export default schemas;
