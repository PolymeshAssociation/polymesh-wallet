import BaseStore from '@polkadot/extension-base/stores/Base';
import CryptoJS from 'crypto-js';

import { NetworkName } from '../types';

export class AuxStore extends BaseStore<string> {
  constructor () {
    super('did');
  }

  public getN (did: string, network: NetworkName, password: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      super.get(`${network.toLowerCase()}:${did}`, (ciphertext) => {
        if (ciphertext && ciphertext.length) {
          const value = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);

          if (!value.length) {
            reject(new Error('Password invalid'));
          }

          resolve(value);
        }

        resolve(null);
      });
    });
  }

  public removeN (did: string, network: NetworkName, update?: () => void): void {
    super.remove(`${network.toLowerCase()}:${did}`, update);
  }

  public setN (did: string, network: NetworkName, uid: string, password: string, update?: () => void): void {
    const cipherText = CryptoJS.AES.encrypt(uid, password).toString();

    super.set(`${network.toLowerCase()}:${did}`, cipherText, update);
  }
}

export default new AuxStore();
