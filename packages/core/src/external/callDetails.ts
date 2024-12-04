import type { Call } from '@polkadot/types/interfaces';
import type { AnyJson, Codec, SignerPayloadJSON } from '@polkadot/types/types';
import type { Enum } from '@polkadot/types-codec';
import type { ResponsePolyCallDetails } from '@polymeshassociation/extension-core/background/types';

import { Vec } from '@polkadot/types-codec';
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

  // Helper function to check if a value is a Call
  function isCall (value: Codec): value is Call {
    return 'callIndex' in value && 'argsEntries' in value;
  }

  // Helper function to check if a value is a Vec
  function isVec (value: Codec): value is Vec<Codec> {
    return value instanceof Vec;
  }

  // Helper function to calculate protocol fee
  async function calculateProtocolFee (call: Call): Promise<string> {
    let totalProtocolFee = '0';
    const { method, section } = call;
    let opName = upperFirst(section) + upperFirst(method);

    const protocolFeeOpEnum: Enum = api.registry.createType('PolymeshCommonUtilitiesProtocolFeeProtocolOp');

    // TODO: Remove once AssetRegisterUniqueTicker is added to PolymeshCommonUtilitiesProtocolFeeProtocolOp
    if (opName === 'AssetRegisterUniqueTicker') {
      if (!protocolFeeOpEnum.defKeys.includes(opName)) {
        opName = 'AssetRegisterTicker';
      }
    }

    if (protocolFeeOpEnum.defKeys.includes(opName)) {
      const fee = (await api.query.protocolFee.baseFees(opName)).toString();

      totalProtocolFee = (BigInt(totalProtocolFee) + BigInt(fee)).toString();
    }

    async function processArg (arg: Codec): Promise<void> {
      if (isVec(arg)) {
        for (const nestedArg of arg) {
          await processArg(nestedArg);
        }
      } else if (isCall(arg)) {
        const nestedFee = await calculateProtocolFee(arg);

        totalProtocolFee = (BigInt(totalProtocolFee) + BigInt(nestedFee)).toString();
      }
    }

    for (const [_, arg] of call.argsEntries) {
      await processArg(arg);
    }

    return totalProtocolFee;
  }

  // Protocol fee
  try {
    protocolFee = await calculateProtocolFee(call);
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
