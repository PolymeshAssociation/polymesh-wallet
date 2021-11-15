import BaseStore from '@polkadot/extension-base/stores/Base';
import CryptoJS from 'crypto-js';

import { NetworkName, UidRecord } from '../../types';

const PREFIX = 'did';

export default class AuxStore extends BaseStore<string> {
  constructor() {
    super(PREFIX);
  }

  private _allKeys(): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        null,
        (result: Record<string, unknown>): void => {
          const keys = Object.entries(result)
            .filter(([key]) => key.startsWith(`${PREFIX}:`))
            .map(([key]) => key.replace(`${PREFIX}:`, ''));

          resolve(keys);
        }
      );
    });
  }

  private _setn(
    key: string,
    value: string,
    password: string,
    update?: () => void
  ): void {
    const cipherText = CryptoJS.AES.encrypt(value, password).toString();

    super.set(key, cipherText, update);
  }

  private _getn(key: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      super.get(key, (ciphertext) => {
        if (ciphertext && ciphertext.length) {
          const value = CryptoJS.AES.decrypt(ciphertext, password).toString(
            CryptoJS.enc.Utf8
          );

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

  public getn(
    did: string,
    network: NetworkName,
    password: string
  ): Promise<string> {
    return this._getn(`${network.toLowerCase()}:${did}`, password);
  }

  public setn(
    did: string,
    network: NetworkName,
    value: string,
    password: string,
    update?: () => void
  ): void {
    return this._setn(
      `${network.toLowerCase()}:${did}`,
      value,
      password,
      update
    );
  }

  public async allRecords(): Promise<UidRecord[]> {
    const keys = await this._allKeys();

    return keys.map((key) => {
      const [network, did] = key.split(':');

      return { network, did } as UidRecord;
    });
  }

  public async changePassword(oldPass: string, newPass: string): Promise<void> {
    const keys = await this._allKeys();

    let i = 0;
    const values = [];

    try {
      for (i; i < keys.length; i++) {
        const value = await this._getn(keys[i], oldPass);

        values.push(value);
        this._setn(keys[i], value, newPass);
      }
    } catch (error) {
      for (let j = 0; j < i; j++) {
        this._setn(keys[j], values[j], oldPass);
      }

      // Escalate error
      throw new Error(
        'Password change failed: Some or all items cannot be decrypted with the provided password.'
      );
    }
  }
}
