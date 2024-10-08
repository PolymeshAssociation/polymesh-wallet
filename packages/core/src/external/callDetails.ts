import type { Call } from '@polkadot/types/interfaces';
import type { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';
import type { ResponsePolyCallDetails } from '@polymeshassociation/extension-core/background/types';

import { upperFirst } from 'lodash-es';

import apiPromise from './apiPromise';

async function callDetails (
  request: SignerPayloadJSON,
  networkUrl: string
): Promise<ResponsePolyCallDetails> {
  const api = await apiPromise(networkUrl);
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
    console.log(
      `Error: Protocol fee retrieval for method ${section}:${method} has failed`,
      error
    );
  }

  // Network fee
  try {
    const extrinsic = api.tx[section][method](...args);
    const { partialFee } = await extrinsic.paymentInfo(request.address);

    networkFee = partialFee.toString();
  } catch (error) {
    console.log(
      `Error: Network fee retrieval for method ${section}:${method} has failed`,
      error
    );
  }

  return {
    args: humanArgs,
    meta,
    method,
    networkFee,
    protocolFee,
    section
  };
}

export default callDetails;
