
import puppeteer from 'puppeteer';

export async function refillTextInput (handle: puppeteer.ElementHandle<Element>, text: string): Promise<puppeteer.ElementHandle<Element>> {
  await handle.click({ clickCount: 3 });
  await handle.press('Backspace');
  await handle.type(text);

  return handle;
}

export function expectHashToEqual (page: puppeteer.Page, hash: string): void {
  return expect(new URL(page.url()).hash).toEqual(hash);
}
