
import { SignerPayloadJSON } from '@polkadot/types/types';
import { ORIGINS } from '@polymathnetwork/extension-core/constants';
import puppeteer, { JSONObject } from 'puppeteer';

export async function refillTextInput (handle: puppeteer.ElementHandle<Element>, text: string): Promise<puppeteer.ElementHandle<Element>> {
  await handle.click({ clickCount: 3 });
  await handle.press('Backspace');
  await handle.type(text);

  return handle;
}

export function expectHashToEqual (page: puppeteer.Page, hash: string): void {
  return expect(new URL(page.url()).hash).toEqual(hash);
}

export async function requestSigning (page: puppeteer.Page, address: string): Promise<void> {
  // Extrinsic payload: Transfer 0 PolyX from {address} to {address}
  const request: SignerPayloadJSON = { address,
    blockHash: '0xa9195303fe7e5d25c22943bc6205daa217e6d04ca9ef5938909fc50dc4fc906a',
    blockNumber: '0x0038e185',
    era: '0x5500',
    genesisHash: '0x12fddc9e2128b3fe571e4e5427addcb87fcaf08493867a68dd6ae44b406b39c7',
    method: '0x0400ff549b9c93a68c946441854b286f843d6413b54eb490fe2940888bb4203cadb65600',
    nonce: '0x00000000',
    signedExtensions: ['CheckSpecVersion', 'CheckTxVersion', 'CheckGenesis', 'CheckMortality', 'CheckNonce', 'CheckWeight', 'ChargeTransactionPayment', 'StoreCallMetadata'],
    specVersion: '0x000007e3',
    tip: '0x00000000000000000000000000000000',
    transactionVersion: '0x00000007',
    version: 4 };

  const msg = { id: '0.1',
    message: 'pub(extrinsic.sign)',
    origin: ORIGINS.PAGE,
    request: request };

  // Send singing request to extension, via extension's content script.
  await page.evaluate((msg) => {
    window.postMessage(msg, '*');
  }, msg as unknown as JSONObject);
}

export function requestAuthorization (): void {
  const msg = { id: '0.1', message: '', origin: ORIGINS.PAGE, request: { origin: '0x01' } };

  msg.message = 'pub(authorize.tab)';
  window.postMessage(msg, '*');
}
