import apiPromise from './apiPromise';
import { SignerPayloadJSON, AnyJson } from '@polkadot/types/types';
import { upperFirst } from 'lodash-es';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { NetworkName } from '../types';
import { Call } from '@polkadot/types/interfaces';

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
    console.error(`Error: Protocol fee retrieval for method ${method.sectionName}:${method.methodName} has failed`, error);
  }

  // Network fee
  try {
    const extrinsic = api.tx[method.sectionName][method.methodName](...method.args);

    const waitLimiter = () => new Promise((resolve) =>
      setTimeout(() => resolve({ partialFee: 'Cannot retrieve network fees at the moment' }), 10000));

    // @ts-ignore
    const { partialFee } = await Promise.race([waitLimiter(), extrinsic.paymentInfo(request.address)]);

    networkFee = partialFee.toString();
  } catch (error) {
    console.error(`Error: Network fee retrieval for method ${method.sectionName}:${method.methodName} has failed`, error);
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
