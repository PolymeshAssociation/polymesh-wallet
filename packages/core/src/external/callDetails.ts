import { Call } from '@polkadot/types/interfaces';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { upperFirst } from 'lodash-es';

import { NetworkName } from '../types';
import apiPromise from './apiPromise';

async function callDetails (request: SignerPayloadJSON, network: NetworkName): Promise<ResponsePolyCallDetails> {
  const api = await apiPromise(network, false);
  let protocolFee = '0';
  let networkFee = '0';

  const call: Call = api.registry.createType('Call', request.method);
  const humanArgs: AnyJson = (call.toHuman() as { args: AnyJson }).args;
  const { args, meta, method, section } = call;

  // Protocol fee
  try {
    const opName = upperFirst(section) + upperFirst(method);

    protocolFee = (await api.query.protocolFee.baseFees(opName)).toString();
  } catch (error) {
    console.log(`Error: Protocol fee retrieval for method ${section}:${method} has failed`, error);
  }

  // Network fee
  try {
    const extrinsic = api.tx[section][method](...args);
    const { partialFee } = await extrinsic.paymentInfo(request.address);

    networkFee = partialFee.toString();
  } catch (error) {
    console.log(`Error: Network fee retrieval for method ${section}:${method} has failed`, error);
  }

  return {
    protocolFee,
    networkFee,
    method,
    section,
    meta,
    args: humanArgs
  };
}

export default callDetails;
