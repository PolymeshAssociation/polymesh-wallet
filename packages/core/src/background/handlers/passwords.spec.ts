import type { KeyringPair } from '@polkadot/keyring/types';

import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';

import { canUnlock, changeAllPasswords } from './passwords';

const OLD = 'old-password';
const NEW = 'new-password';

// Pairs as the wallet holds them: loaded from JSON encrypted with `password`, and locked.
function storedPair (keyring: Keyring, password: string): KeyringPair {
  const json = keyring.createFromUri(mnemonicGenerate()).toJson(password);

  return keyring.createFromJson(json);
}

// Stands in for ui-keyring's encryptAccount: re-encodes the pair with the new password.
function encrypt (pair: KeyringPair, password: string): void {
  pair.encodePkcs8(password);
}

describe('changeAllPasswords', () => {
  let keyring: Keyring;

  beforeAll(async () => {
    await cryptoWaitReady();
    keyring = new Keyring({ type: 'sr25519' });
  });

  it('changes every pair to the new password', () => {
    const pairs = [storedPair(keyring, OLD), storedPair(keyring, OLD)];

    expect(changeAllPasswords(pairs, OLD, NEW, encrypt)).toBe(true);
    expect(pairs.map((pair) => canUnlock(pair, NEW))).toEqual([true, true]);
    expect(pairs.every(({ isLocked }) => isLocked)).toBe(true);
  });

  // The 2.7.0 loop missed a failure on the last pair and reported success.
  it('fails and changes nothing when the old password does not open the last pair', () => {
    const pairs = [storedPair(keyring, OLD), storedPair(keyring, OLD), storedPair(keyring, 'other')];

    expect(changeAllPasswords(pairs, OLD, NEW, encrypt)).toBe(false);
    expect(pairs.map((pair) => canUnlock(pair, OLD))).toEqual([true, true, false]);
  });

  it('fails and changes nothing when the old password does not open the first pair', () => {
    const pairs = [storedPair(keyring, 'other'), storedPair(keyring, OLD)];

    expect(changeAllPasswords(pairs, OLD, NEW, encrypt)).toBe(false);
    expect(canUnlock(pairs[1], OLD)).toBe(true);
  });

  it('restores the pairs already changed when re-encrypting fails part way', () => {
    const pairs = [storedPair(keyring, OLD), storedPair(keyring, OLD), storedPair(keyring, OLD)];
    let calls = 0;

    const failOnThird = (pair: KeyringPair, password: string): void => {
      if (++calls === 3) {
        throw new Error('storage failure');
      }

      encrypt(pair, password);
    };

    expect(changeAllPasswords(pairs, OLD, NEW, failOnThird)).toBe(false);
    expect(pairs.map((pair) => canUnlock(pair, OLD))).toEqual([true, true, true]);
  });
});

describe('canUnlock', () => {
  it('leaves the pair locked whether or not the password is right', async () => {
    await cryptoWaitReady();
    const pair = storedPair(new Keyring({ type: 'sr25519' }), OLD);

    expect(canUnlock(pair, OLD)).toBe(true);
    expect(pair.isLocked).toBe(true);
    expect(canUnlock(pair, NEW)).toBe(false);
    expect(pair.isLocked).toBe(true);
  });

  it('keeps an unlocked pair unlocked when the password is right', async () => {
    await cryptoWaitReady();
    const pair = storedPair(new Keyring({ type: 'sr25519' }), OLD);

    pair.decodePkcs8(OLD);

    expect(canUnlock(pair, OLD)).toBe(true);
    expect(pair.isLocked).toBe(false);
  });
});
