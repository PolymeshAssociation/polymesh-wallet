import { Call } from '@polkadot/types/interfaces';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { upperFirst } from 'lodash-es';

import { NetworkName } from '../types';
import apiPromise from './apiPromise';

async function callDetails (request: SignerPayloadJSON, network: NetworkName): Promise<ResponsePolyCallDetails> {
  const api = await apiPromise(network);
  let protocolFee = '0';
  let networkFee = '0';

  const method: Call = api.registry.createType('Call', request.method);
  const args: AnyJson = (method.toHuman() as { args: AnyJson }).args;

  // Protocol fee
  try {
    const opName = upperFirst(method.sectionName) + upperFirst(method.methodName);

    protocolFee = (await api.query.protocolFee.baseFees(opName)).toString();
  } catch (error) {
    console.log(`Error: Protocol fee retrieval for method ${method.sectionName}:${method.methodName} has failed`, error);
  }

  // Network fee
  try {
    const extrinsic = api.tx[method.sectionName][method.methodName](...method.args);
    const { partialFee } = await extrinsic.paymentInfo(request.address);

    networkFee = partialFee.toString();
  } catch (error) {
    console.log(`Error: Network fee retrieval for method ${method.sectionName}:${method.methodName} has failed`, error);
  }

  return {
    protocolFee,
    networkFee,
    method: method.methodName,
    section: method.sectionName,
    meta: method.meta,
    args: args
  };
}

export default callDetails;
