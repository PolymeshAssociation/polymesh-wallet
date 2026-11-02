import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import { assertExtrinsicPayload, assertRawPayload } from './signingPayloads';

const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

const extrinsic = {
  address,
  blockHash: `0x${'11'.repeat(32)}`,
  blockNumber: '0x00000001',
  era: '0x00',
  genesisHash: `0x${'22'.repeat(32)}`,
  method: '0x0500',
  nonce: '0x00000000',
  signedExtensions: ['CheckNonce'],
  specVersion: '0x00000001',
  tip: '0x00000000000000000000000000000000',
  transactionVersion: '0x00000001',
  version: 4
};

const asExtrinsic = (payload: unknown) => payload as SignerPayloadJSON;
const asRaw = (payload: unknown) => payload as SignerPayloadRaw;

describe('assertExtrinsicPayload', () => {
  it('accepts a complete payload', () => {
    expect(() => assertExtrinsicPayload(asExtrinsic(extrinsic))).not.toThrow();
  });

  it('accepts a payload without its optional fields', () => {
    const { blockNumber: _omitted, ...rest } = extrinsic;

    expect(() => assertExtrinsicPayload(asExtrinsic(rest))).not.toThrow();
    expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, assetId: null, metadataHash: undefined }))).not.toThrow();
  });

  it('rejects an address with nothing else', () => {
    expect(() => assertExtrinsicPayload(asExtrinsic({ address }))).toThrow();
  });

  for (const field of ['blockHash', 'era', 'genesisHash', 'method', 'nonce', 'specVersion', 'tip', 'transactionVersion']) {
    it(`rejects a missing or non-hex ${field}`, () => {
      const missing: Record<string, unknown> = { ...extrinsic };

      delete missing[field];

      expect(() => assertExtrinsicPayload(asExtrinsic(missing))).toThrow(new RegExp(field));
      expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, [field]: { a: 1 } }))).toThrow(new RegExp(field));
      expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, [field]: 'nothex' }))).toThrow(new RegExp(field));
    });
  }

  it('rejects a non-hex optional field the popup would render', () => {
    expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, metadataHash: { a: 1 } }))).toThrow(/metadataHash/);
  });

  it('rejects a bad version or signedExtensions', () => {
    expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, version: '4' }))).toThrow(/version/);
    expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, signedExtensions: 'x' }))).toThrow(/signedExtensions/);
    expect(() => assertExtrinsicPayload(asExtrinsic({ ...extrinsic, signedExtensions: [1] }))).toThrow(/signedExtensions/);
  });
});

describe('assertRawPayload', () => {
  it('accepts hex or text data', () => {
    expect(() => assertRawPayload(asRaw({ address, data: '0x68656c6c6f', type: 'bytes' }))).not.toThrow();
    expect(() => assertRawPayload(asRaw({ address, data: 'hello', type: 'bytes' }))).not.toThrow();
  });

  it('rejects missing, empty or non-string data', () => {
    expect(() => assertRawPayload(asRaw({ address, type: 'bytes' }))).toThrow();
    expect(() => assertRawPayload(asRaw({ address, data: '', type: 'bytes' }))).toThrow();
    expect(() => assertRawPayload(asRaw({ address, data: { a: 1 }, type: 'bytes' }))).toThrow();
  });
});
