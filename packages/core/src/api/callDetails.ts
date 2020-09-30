import apiPromise from './apiPromise';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { upperFirst } from 'lodash-es';
import { ResponseCallDetails } from '@polkadot/extension-core/background/types';
import { NetworkName } from '../types';

async function callDetails (request: SignerPayloadJSON, network: NetworkName): Promise<ResponseCallDetails> {
  const api = await apiPromise[network];
  let protocolFee = '0';
  let networkFee = '0';

  // Parse method
  const res = api.registry.createType('Call', request.method);
  const { args, method, section } = res;

  // Protocol fee
  try {
    const opName = upperFirst(section) + upperFirst(method);

    protocolFee = (await api.query.protocolFee.baseFees(opName)).toString();
  } catch (error) {
    console.error(`Error: Protocol fee retrieval for method ${section}:${method} has failed`, error);
  }

  // Network fee
  try {
    const extrinsic = api.tx[section][method](...args);
    const { partialFee } = await extrinsic.paymentInfo(request.address);

    networkFee = partialFee.toString();
  } catch (error) {
    console.error(`Error: Network fee retrieval for method ${section}:${method} has failed`, error);
  }

  return {
    protocolFee,
    networkFee,
    module: section,
    method
  };
}

export default callDetails;
