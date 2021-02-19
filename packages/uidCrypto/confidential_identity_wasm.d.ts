/* tslint:disable */
/* eslint-disable */
/**
* Creates a CDD_ID from investor did and investor uid
*
* # Arguments
* * `cdd_claim` a stringified json with the following format:
*   { "investor_did": [32_bytes_array], "investor_unique_id": [16_bytes_array] }
*
* # Errors
* * Failure to deserialize the cdd claim.
* * Failure to serialize the cdd id.
* @param {string} cdd_claim
* @returns {string}
*/
export function process_create_cdd_id(cdd_claim: string): string;
/**
* Creates a scope claim proof for an investor from investor did, investor uid, and scope did.
*
* # Arguments
* * `cdd_claim` a stringified json with the following format:
*   { "investor_did": [32_bytes_array], "investor_unique_id": [16_bytes_array] }
* * `scoped_claim` a stringified json with the following format:
*   { "scope_did":[12_bytes_array], "investor_unique_id":[16_bytes_array] }
*
* # Errors
* * Failure to deserialize the cdd claim.
* * Failure to deserialize the scope claim.
* * Failure to serialize the proof.
* @param {string} cdd_claim
* @param {string} scoped_claim
* @returns {string}
*/
export function process_create_claim_proof(cdd_claim: string, scoped_claim: string): string;
/**
* @param {string} did
* @returns {string}
*/
export function process_create_mocked_investor_uid(did: string): string;
