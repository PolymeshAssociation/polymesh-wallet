import BaseStore from '@polkadot/extension-base/stores/Base';
import CryptoJS from 'crypto-js';

import { NetworkName } from '../../types';

const PREFIX = 'did';

export default class AuxStore extends BaseStore<string> {
  constructor () {
    super(PREFIX);
  }

  public getNDecrypt (key: string, password: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      super.get(key, (ciphertext) => {
        if (ciphertext && ciphertext.length) {
          const value = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);

          if (!value.length) {
            reject(new Error('Password invalid'));
          }

          resolve(value);
        } else {
          reject(new Error('Uid not found'));
        }
      });
    });
  }

  public getN (did: string, network: NetworkName, password: string): Promise<string> {
    return this.getNDecrypt(`${network.toLowerCase()}:${did}`, password);
  }

  public remove (): void {
    // Noop
    throw new Error('Cannot remove a key from auxStore');
  }

  public set (_key: string, value: string, update?: () => void): void {
    // Noop
    throw new Error('Cannot remove a key from auxStore');
  }

  public setNEncrypt (key: string, value: string, password: string, update?: () => void): void {
    const cipherText = CryptoJS.AES.encrypt(value, password).toString();

    super.set(key, cipherText, update);
  }

  public setN (did: string, network: NetworkName, value: string, password: string, update?: () => void): void {
    return this.setNEncrypt(`${network.toLowerCase()}:${did}`, value, password, update);
  }

  public allKeys (): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result: Record<string, unknown>): void => {
        const keys = Object
          .entries(result)
          .filter(([key]) => key.startsWith(`${PREFIX}:`))
          .map(([key]) => key.replace(`${PREFIX}:`, ''));

        resolve(keys);
      });
    });
  }
}
