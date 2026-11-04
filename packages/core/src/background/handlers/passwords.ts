import type { KeyringPair } from '@polkadot/keyring/types';

type EncryptFn = (pair: KeyringPair, password: string) => void;

/**
 * Checks whether `password` decrypts the pair. A locked pair is left locked, so the check
 * does not keep a decrypted secret key in memory. A pair already unlocked (by a remembered
 * signing password) stays unlocked if the password is right.
 */
export function canUnlock (pair: KeyringPair, password: string): boolean {
  const wasUnlocked = !pair.isLocked;
  let unlocked = false;

  try {
    pair.lock();
    pair.decodePkcs8(password);
    unlocked = true;
  } catch (_error) {
    unlocked = false;
  } finally {
    if (!(wasUnlocked && unlocked)) {
      pair.lock();
    }
  }

  return unlocked;
}

function reencrypt (pair: KeyringPair, oldPass: string, newPass: string, encrypt: EncryptFn): void {
  try {
    pair.decodePkcs8(oldPass);
    encrypt(pair, newPass);
  } finally {
    pair.lock();
  }
}

/**
 * Puts a pair back on `oldPass` after a failed change. The pair that `encrypt` threw on may
 * or may not have been re-encoded already (ui-keyring re-encodes it in `toJson`, then can
 * still throw while storing it), so a pair that `newPass` does not open was never changed
 * and is left as it is.
 */
function restore (pair: KeyringPair, oldPass: string, newPass: string, encrypt: EncryptFn): void {
  try {
    pair.decodePkcs8(newPass);
  } catch (_error) {
    pair.lock();

    return;
  }

  try {
    encrypt(pair, oldPass);
  } finally {
    pair.lock();
  }
}

/**
 * Re-encrypts every pair from `oldPass` to `newPass`.
 *
 * Every pair is checked against `oldPass` before any is changed, so a pair that the old
 * password does not open leaves the whole wallet on the old password. If `encrypt` throws
 * part way, the pairs already changed, and the one it threw on, are restored to `oldPass`.
 *
 * This does not cover storage: ui-keyring saves accounts without waiting for the write and
 * only logs a failed write, so a write that fails here is never seen and is not rolled back.
 */
export function changeAllPasswords (pairs: KeyringPair[], oldPass: string, newPass: string, encrypt: EncryptFn): boolean {
  const failed = pairs.filter((pair) => !canUnlock(pair, oldPass));

  if (failed.length) {
    console.error('Current password does not unlock accounts', failed.map(({ address }) => address));

    return false;
  }

  const changed: KeyringPair[] = [];

  try {
    for (const pair of pairs) {
      // Recorded before the attempt: `encrypt` can re-encode the pair and then throw.
      changed.push(pair);
      reencrypt(pair, oldPass, newPass, encrypt);
    }
  } catch (error) {
    console.error('Changing password failed. Rolling back...', error);

    for (const pair of changed) {
      try {
        restore(pair, oldPass, newPass, encrypt);
      } catch (rollbackError) {
        console.error('Rolling back password of account', pair.address, 'has failed', rollbackError);
      }
    }

    return false;
  }

  return true;
}
