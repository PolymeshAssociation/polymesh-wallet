import type DotState from '@polkadot/extension-base/background/handlers/State';
import type { RequestSign } from '@polkadot/extension-base/background/types';

import DotTabs from '@polkadot/extension-base/background/handlers/Tabs';
import RequestBytesSign from '@polkadot/extension-base/background/RequestBytesSign';
import RequestExtrinsicSign from '@polkadot/extension-base/background/RequestExtrinsicSign';
import { isExtrinsicRequest } from '@polkadot/extension-base/utils';
import { stringToHex } from '@polkadot/util';

const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const data = stringToHex('Sign in to Example');

const extrinsic = {
  address,
  blockHash: `0x${'11'.repeat(32)}`,
  era: '0x00',
  genesisHash: `0x${'22'.repeat(32)}`,
  method: '0x0500',
  nonce: '0x00000000',
  signedExtensions: [],
  specVersion: '0x00000001',
  tip: '0x00000000000000000000000000000000',
  transactionVersion: '0x00000001',
  version: 4
};

// What the popup receives: requests reach it serialized over the extension port.
function overPort (request: unknown): RequestSign {
  return JSON.parse(JSON.stringify(request)) as RequestSign;
}

// Our Tabs handler passes signing messages straight to this upstream handler. It is used directly
// because ours can't load under the node test runner (directory import in polymesh-types).
describe('signing requests from a tab', () => {
  const tabs = new DotTabs({ ensureUrlAuthorized: () => true } as unknown as DotState);
  const send = (payload: unknown) => tabs.handle('1', 'pub(extrinsic.sign)', payload as never, 'https://example.test', undefined as never);

  // A popup that reads `data` would show this as a message, while it is signed as a transaction.
  it('rejects a transaction payload carrying raw data', async () => {
    await expect(send({ ...extrinsic, data })).rejects.toThrow(/Unexpected raw data/);
  });

  it('passes a normal transaction payload on to be signed', async () => {
    // The keyring isn't loaded here, so reaching it means the payload was accepted.
    await expect(send(extrinsic)).rejects.toThrow(/Keyring should be initialised/);
  });

  it('tells the popup which channel a request arrived on, whatever the payload says', () => {
    expect(isExtrinsicRequest(overPort(new RequestExtrinsicSign({ ...extrinsic, data } as never)))).toBe(true);
    expect(isExtrinsicRequest(overPort(new RequestBytesSign({ address, data, type: 'bytes' })))).toBe(false);
    expect(isExtrinsicRequest(overPort(new RequestBytesSign({ ...extrinsic, data, type: 'bytes' } as never)))).toBe(false);
  });
});
