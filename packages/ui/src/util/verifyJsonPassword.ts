import createPair from '@polkadot/keyring/pair';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { hexToU8a, isHex } from '@polkadot/util';
import { base64Decode, decodeAddress, encodeAddress } from '@polkadot/util-crypto';

function verifyJsonPassword (json: KeyringPair$Json, password: string): boolean {
  try {
    const cryptoType = Array.isArray(json.encoding.content) ? json.encoding.content[1] : 'ed25519';
    const encType = Array.isArray(json.encoding.type) ? json.encoding.type : [json.encoding.type];
    const pair = createPair(
      { toSS58: encodeAddress, type: cryptoType },
      { publicKey: decodeAddress(json.address, true) },
      json.meta,
      isHex(json.encoded) ? hexToU8a(json.encoded) : base64Decode(json.encoded),
      encType
    );

    pair.decodePkcs8(password);
  } catch (error) {
    console.error('Decoding JSON failed', error);

    return false;
  }

  return true;
}

export default verifyJsonPassword;
