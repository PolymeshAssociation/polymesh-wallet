import { hexToU8a, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { parse as uuidParse } from 'uuid';

export const stringToUnpadded = (input: string) => input.replace(/\0/g, '');

export const stringToPadded = (string: string, maxChars = 12) =>
  `${string}${'\u0000'.repeat(maxChars - string.length)}`;

export const stringToPaddedHex = (string: string) => stringToHex(stringToPadded(string));

export async function getScopeAttestationProof (
  did: string,
  uid: string,
  ticker: string
) {
  const crypto = await import('../../../../uidCrypto');
  const u8ScopeDid = stringToU8a(stringToPadded(ticker));
  const u8did = hexToU8a(did);
  const u8uid = uuidParse(uid);

  const cddClaim = JSON.stringify({
    investor_did: Array.from(u8did),
    investor_unique_id: Array.from(u8uid)
  });

  const scopedClaim = JSON.stringify({
    scope_did: Array.from(u8ScopeDid),
    investor_unique_id: Array.from(u8uid)
  });

  const claimProofString = crypto.process_create_claim_proof(cddClaim, scopedClaim);

  const claimProof = JSON.parse(claimProofString);

  Object.keys(claimProof).forEach((key) => {
    claimProof[key] = u8aToHex(claimProof[key]);
  });

  return claimProof;
}
