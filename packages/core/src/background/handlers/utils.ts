import { hexToU8a, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

export const stringToUnpadded = (input: string) => input.replace(/\0/g, '');

export const stringToPadded = (string: string, maxChars = 12) =>
  `${string}${'\u0000'.repeat(maxChars - string.length)}`;

export const stringToPaddedHex = (string: string) => stringToHex(stringToPadded(string));

export async function getMockUId (did: string) {
  const crypto = await import('../../../../uidCrypto');
  const mockUIdHex = `0x${crypto.process_create_mocked_investor_uid(did)}`;
  const mockUId = uuidStringify(hexToU8a(mockUIdHex));

  return mockUId;
}

export async function getScopeAttestationProof (
  investorDid: string,
  investorUId: string,
  ticker: string
) {
  const crypto = await import('../../../../uidCrypto');
  const u8ScopeDid = stringToU8a(stringToPadded(ticker));
  const u8InvestorDid = hexToU8a(investorDid);
  const u8InvestorUId = uuidParse(investorUId);
  const cddClaim = JSON.stringify({
    investor_did: Array.from(u8InvestorDid),
    investor_unique_id: Array.from(u8InvestorUId)
  });
  const scopedClaim = JSON.stringify({
    scope_did: Array.from(u8ScopeDid),
    investor_unique_id: Array.from(u8InvestorUId)
  });
  const claimProofString = crypto.process_create_claim_proof(cddClaim, scopedClaim);

  const claimProof = JSON.parse(claimProofString);

  Object.keys(claimProof).forEach((key) => {
    claimProof[key] = u8aToHex(claimProof[key]);
  });

  return claimProof;
}
