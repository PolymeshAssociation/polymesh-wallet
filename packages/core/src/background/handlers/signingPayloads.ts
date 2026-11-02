import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import { assert, isHex } from '@polkadot/util';

// Payloads come from the dApp, and the signing popup renders their fields as they are. Most malformed
// payloads still decode, with defaults, so reject them here: no popup opens and the dApp gets the error.

const REQUIRED_HEX: (keyof SignerPayloadJSON)[] = ['blockHash', 'era', 'genesisHash', 'method', 'nonce', 'specVersion', 'tip', 'transactionVersion'];
const OPTIONAL_HEX: (keyof SignerPayloadJSON)[] = ['assetId', 'blockNumber', 'metadataHash'];

function isHexValue (value: unknown): boolean {
  return isHex(value, -1, true);
}

export function assertExtrinsicPayload (payload: SignerPayloadJSON): void {
  for (const field of REQUIRED_HEX) {
    assert(isHexValue(payload[field]), `Invalid transaction payload: ${field} must be a hex string`);
  }

  for (const field of OPTIONAL_HEX) {
    const value = payload[field];

    assert(value === undefined || value === null || isHexValue(value), `Invalid transaction payload: ${field} must be a hex string`);
  }

  assert(typeof payload.version === 'number', 'Invalid transaction payload: version must be a number');
  assert(
    Array.isArray(payload.signedExtensions) && payload.signedExtensions.every((name) => typeof name === 'string'),
    'Invalid transaction payload: signedExtensions must be a list of names'
  );
}

export function assertRawPayload (payload: SignerPayloadRaw): void {
  assert(typeof payload.data === 'string' && payload.data.length > 0, 'Invalid raw payload: data must be a non-empty string');
}
