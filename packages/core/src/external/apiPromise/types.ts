// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { ITuple } from '@polkadot/types/types';
import { Enum, Option, Struct, U8aFixed, Vec } from '@polkadot/types/codec';
import { Bytes, Text, bool, u16, u32, u64, u8 } from '@polkadot/types/primitive';
import { Signature } from '@polkadot/types/interfaces/extrinsics';
import {
  AccountId,
  Balance,
  BlockNumber,
  Call,
  H256,
  H512,
  Hash,
  Moment,
} from '@polkadot/types/interfaces/runtime';

/** @name AccountKey */
export interface AccountKey extends U8aFixed {}

/** @name AssetDidResult */
export interface AssetDidResult extends Enum {
  readonly isOk: boolean;
  readonly asOk: IdentityId;
  readonly isErr: boolean;
  readonly asErr: Bytes;
}

/** @name AssetIdentifier */
export interface AssetIdentifier extends Text {}

/** @name AssetName */
export interface AssetName extends Text {}

/** @name AssetTransferRule */
export interface AssetTransferRule extends Struct {
  readonly sender_rules: Vec<Rule>;
  readonly receiver_rules: Vec<Rule>;
  readonly rule_id: u32;
}

/** @name AssetTransferRuleResult */
export interface AssetTransferRuleResult extends Struct {
  readonly sender_rules: Vec<Rule>;
  readonly receiver_rules: Vec<Rule>;
  readonly rule_id: u32;
  readonly transfer_rule_result: bool;
}

/** @name AssetTransferRules */
export interface AssetTransferRules extends Struct {
  readonly is_paused: bool;
  readonly rules: Vec<AssetTransferRule>;
}

/** @name AssetTransferRulesResult */
export interface AssetTransferRulesResult extends Struct {
  readonly is_paused: bool;
  readonly rules: Vec<AssetTransferRuleResult>;
  readonly final_result: bool;
}

/** @name AssetType */
export interface AssetType extends Enum {
  readonly isEquityCommon: boolean;
  readonly isEquityPreferred: boolean;
  readonly isCommodity: boolean;
  readonly isFixedIncome: boolean;
  readonly isReit: boolean;
  readonly isFund: boolean;
  readonly isRevenueShareAgreement: boolean;
  readonly isStructuredProduct: boolean;
  readonly isDerivative: boolean;
  readonly isCustom: boolean;
  readonly asCustom: Bytes;
}

/** @name AuthIdentifier */
export interface AuthIdentifier extends Struct {
  readonly signatory: Signatory;
  readonly auth_id: u64;
}

/** @name Authorization */
export interface Authorization extends Struct {
  readonly authorization_data: AuthorizationData;
  readonly authorized_by: Signatory;
  readonly expiry: Option<Moment>;
  readonly auth_id: u64;
}

/** @name AuthorizationData */
export interface AuthorizationData extends Enum {
  readonly isAttestMasterKeyRotation: boolean;
  readonly asAttestMasterKeyRotation: IdentityId;
  readonly isRotateMasterKey: boolean;
  readonly asRotateMasterKey: IdentityId;
  readonly isTransferTicker: boolean;
  readonly asTransferTicker: Ticker;
  readonly isAddMultiSigSigner: boolean;
  readonly isTransferAssetOwnership: boolean;
  readonly asTransferAssetOwnership: Ticker;
  readonly isJoinIdentity: boolean;
  readonly asJoinIdentity: IdentityId;
  readonly isCustom: boolean;
  readonly asCustom: Bytes;
  readonly isNoData: boolean;
}

/** @name AuthorizationNonce */
export interface AuthorizationNonce extends u64 {}

/** @name Ballot */
export interface Ballot extends Struct {
  readonly checkpoint_id: u64;
  readonly voting_start: Moment;
  readonly voting_end: Moment;
  readonly motions: Vec<Motion>;
}

/** @name BatchAddClaimItem */
export interface BatchAddClaimItem extends Struct {
  readonly target: IdentityId;
  readonly claim: Claim;
  readonly expiry: Option<Moment>;
}

/** @name BatchRevokeClaimItem */
export interface BatchRevokeClaimItem extends Struct {
  readonly target: IdentityId;
  readonly claim: Claim;
}

/** @name Beneficiary */
export interface Beneficiary extends Struct {
  readonly id: IdentityId;
  readonly amount: Balance;
}

/** @name BridgeTx */
export interface BridgeTx extends Struct {
  readonly nonce: u32;
  readonly recipient: AccountId;
  readonly value: Balance;
  readonly tx_hash: H256;
}

/** @name BridgeTxDetail */
export interface BridgeTxDetail extends Struct {
  readonly amount: Balance;
  readonly status: BridgeTxStatus;
  readonly execution_block: BlockNumber;
  readonly tx_hash: H256;
}

/** @name BridgeTxStatus */
export interface BridgeTxStatus extends Enum {
  readonly isAbsent: boolean;
  readonly isPending: boolean;
  readonly asPending: u8;
  readonly isFrozen: boolean;
  readonly isTimelocked: boolean;
  readonly isHandled: boolean;
}

/** @name CanTransferResult */
export interface CanTransferResult extends Enum {
  readonly isOk: boolean;
  readonly asOk: u8;
  readonly isErr: boolean;
  readonly asErr: Bytes;
}

/** @name CappedFee */
export interface CappedFee extends u64 {}

/** @name CddStatus */
export interface CddStatus extends Enum {
  readonly isOk: boolean;
  readonly asOk: IdentityId;
  readonly isErr: boolean;
  readonly asErr: Bytes;
}

/** @name Claim */
export interface Claim extends Enum {
  readonly isAccredited: boolean;
  readonly asAccredited: Scope;
  readonly isAffiliate: boolean;
  readonly asAffiliate: Scope;
  readonly isBuyLockup: boolean;
  readonly asBuyLockup: Scope;
  readonly isSellLockup: boolean;
  readonly asSellLockup: Scope;
  readonly isCustomerDueDiligence: boolean;
  readonly isKnowYourCustomer: boolean;
  readonly asKnowYourCustomer: Scope;
  readonly isJurisdiction: boolean;
  readonly asJurisdiction: ITuple<[JurisdictionName, Scope]>;
  readonly isExempted: boolean;
  readonly asExempted: Scope;
  readonly isBlocked: boolean;
  readonly asBlocked: Scope;
  readonly isNoData: boolean;
}

/** @name Claim1stKey */
export interface Claim1stKey extends Struct {
  readonly target: IdentityId;
  readonly claim_type: ClaimType;
}

/** @name Claim2ndKey */
export interface Claim2ndKey extends Struct {
  readonly issuer: IdentityId;
  readonly scope: Option<Scope>;
}

/** @name ClaimType */
export interface ClaimType extends Enum {
  readonly isAccredited: boolean;
  readonly isAffiliate: boolean;
  readonly isBuyLockup: boolean;
  readonly isSellLockup: boolean;
  readonly isCustomerDueDiligence: boolean;
  readonly isKnowYourCustomer: boolean;
  readonly isJurisdiction: boolean;
  readonly isExempted: boolean;
  readonly isBlocked: boolean;
  readonly isNoType: boolean;
}

/** @name Commission */
export interface Commission extends Enum {
  readonly isIndividual: boolean;
  readonly isGlobal: boolean;
  readonly asGlobal: u32;
}

/** @name Compliance */
export interface Compliance extends Enum {
  readonly isPending: boolean;
  readonly isActive: boolean;
}

/** @name Counter */
export interface Counter extends u64 {}

/** @name DepositInfo */
export interface DepositInfo extends Struct {
  readonly owner: AccountKey;
  readonly amount: Balance;
}

/** @name DidRecord */
export interface DidRecord extends Struct {
  readonly roles: Vec<IdentityRole>;
  readonly primary_key: AccountKey;
  readonly secondary_keys: Vec<SigningItem>;
}

/** @name DidRecords */
export interface DidRecords extends Enum {
  readonly isSuccess: boolean;
  readonly asSuccess: DidRecordsSuccess;
  readonly isIdNotFound: boolean;
  readonly asIdNotFound: Bytes;
}

/** @name DidRecordsSuccess */
export interface DidRecordsSuccess extends Struct {
  readonly primary_key: AccountKey;
  readonly signing_items: Vec<SigningItem>;
}

/** @name DidStatus */
export interface DidStatus extends Enum {
  readonly isUnknown: boolean;
  readonly isExists: boolean;
  readonly isCddVerified: boolean;
}

/** @name Dividend */
export interface Dividend extends Struct {
  readonly amount: Balance;
  readonly active: bool;
  readonly matures_at: Option<Moment>;
  readonly expires_at: Option<Moment>;
  readonly payout_currency: Option<Ticker>;
  readonly checkpoint_id: u64;
}

/** @name Document */
export interface Document extends Struct {
  readonly name: DocumentName;
  readonly uri: DocumentUri;
  readonly content_hash: DocumentHash;
}

/** @name DocumentHash */
export interface DocumentHash extends Text {}

/** @name DocumentName */
export interface DocumentName extends Text {}

/** @name DocumentUri */
export interface DocumentUri extends Text {}

/** @name FeeOf */
export interface FeeOf extends Balance {}

/** @name FundingRoundName */
export interface FundingRoundName extends Text {}

/** @name HandledTxStatus */
export interface HandledTxStatus extends Enum {
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly asError: Text;
}

/** @name HistoricalVotingByAddress */
export interface HistoricalVotingByAddress extends Vec<VoteByPip> {}

/** @name HistoricalVotingById */
export interface HistoricalVotingById
  extends Vec<ITuple<[AccountKey, HistoricalVotingByAddress]>> {}

/** @name IdentifierType */
export interface IdentifierType extends Enum {
  readonly isCins: boolean;
  readonly isCusip: boolean;
  readonly isIsin: boolean;
}

/** @name IdentityClaim */
export interface IdentityClaim extends Struct {
  readonly claim_issuer: IdentityId;
  readonly issuance_date: Moment;
  readonly last_update_date: Moment;
  readonly expiry: Option<Moment>;
  readonly claim: Claim;
}

/** @name IdentityClaimKey */
export interface IdentityClaimKey extends Struct {
  readonly id: IdentityId;
  readonly claim_type: ClaimType;
}

/** @name IdentityId */
export interface IdentityId extends U8aFixed {}

/** @name IdentityRole */
export interface IdentityRole extends Enum {
  readonly isIssuer: boolean;
  readonly isSimpleTokenIssuer: boolean;
  readonly isValidator: boolean;
  readonly isClaimIssuer: boolean;
  readonly isInvestor: boolean;
  readonly isNodeRunner: boolean;
  readonly isPm: boolean;
  readonly isCddamlClaimIssuer: boolean;
  readonly isAccreditedInvestorClaimIssuer: boolean;
  readonly isVerifiedIdentityClaimIssuer: boolean;
}

/** @name InactiveMember */
export interface InactiveMember extends Struct {
  readonly id: IdentityId;
  readonly deactivated_at: Moment;
  readonly expiry: Option<Moment>;
}

/** @name Investment */
export interface Investment extends Struct {
  readonly investor_did: IdentityId;
  readonly amount_paid: Balance;
  readonly assets_purchased: Balance;
  readonly last_purchase_date: Moment;
}

/** @name IssueRecipient */
export interface IssueRecipient extends Enum {
  readonly isAccount: boolean;
  readonly asAccount: AccountId;
  readonly isIdentity: boolean;
  readonly asIdentity: IdentityId;
}

/** @name JurisdictionName */
export interface JurisdictionName extends Text {}

/** @name Link */
export interface Link extends Struct {
  readonly link_data: LinkData;
  readonly expiry: Option<Moment>;
  readonly link_id: u64;
}

/** @name LinkData */
export interface LinkData extends Enum {
  readonly isDocumentOwned: boolean;
  readonly asDocumentOwned: Document;
  readonly isTickerOwned: boolean;
  readonly asTickerOwned: Ticker;
  readonly isAssetOwned: boolean;
  readonly asAssetOwned: Ticker;
}

/** @name LinkedKeyInfo */
export interface LinkedKeyInfo extends Enum {
  readonly isUnique: boolean;
  readonly asUnique: IdentityId;
  readonly isGroup: boolean;
  readonly asGroup: Vec<IdentityId>;
}

/** @name LinkType */
export interface LinkType extends Enum {
  readonly isDocumentOwnership: boolean;
  readonly isTickerOwnership: boolean;
  readonly isAssetOwnership: boolean;
  readonly isNoData: boolean;
}

/** @name Memo */
export interface Memo extends U8aFixed {}

/** @name Motion */
export interface Motion extends Struct {
  readonly title: MotionTitle;
  readonly info_link: MotionInfoLink;
  readonly choices: Vec<MotionTitle>;
}

/** @name MotionInfoLink */
export interface MotionInfoLink extends Text {}

/** @name MotionTitle */
export interface MotionTitle extends Text {}

/** @name OffChainSignature */
export interface OffChainSignature extends H512 {}

/** @name OfflineSlashingParams */
export interface OfflineSlashingParams extends Struct {
  readonly max_offline_percent: u32;
  readonly constant: u32;
  readonly max_slash_percent: u32;
}

/** @name PendingTx */
export interface PendingTx extends Struct {
  readonly did: IdentityId;
  readonly bridge_tx: BridgeTx;
}

/** @name Permission */
export interface Permission extends Enum {
  readonly isFull: boolean;
  readonly isAdmin: boolean;
  readonly isOperator: boolean;
  readonly isSpendFunds: boolean;
}

/** @name PermissionedValidator */
export interface PermissionedValidator extends Struct {
  readonly compliance: Compliance;
}

/** @name Pip */
export interface Pip extends Struct {
  readonly id: PipId;
  readonly proposal: Call;
  readonly state: ProposalState;
}

/** @name PipDescription */
export interface PipDescription extends Text {}

/** @name PipId */
export interface PipId extends u32 {}

/** @name PipsMetadata */
export interface PipsMetadata extends Struct {
  readonly proposer: AccountKey;
  readonly id: PipId;
  readonly end: u32;
  readonly url: Option<Url>;
  readonly description: Option<PipDescription>;
  readonly cool_off_until: u32;
  readonly beneficiaries: Vec<Beneficiary>;
}

/** @name PolymeshVotes */
export interface PolymeshVotes extends Struct {
  readonly index: u32;
  readonly ayes: Vec<ITuple<[IdentityId, Balance]>>;
  readonly nays: Vec<ITuple<[IdentityId, Balance]>>;
}

/** @name PosRatio */
export interface PosRatio extends ITuple<[u32, u32]> {}

/** @name PreAuthorizedKeyInfo */
export interface PreAuthorizedKeyInfo extends Struct {
  readonly target_id: IdentityId;
  readonly signing_item: SigningItem;
}

/** @name ProportionMatch */
export interface ProportionMatch extends Enum {
  readonly isAtLeast: boolean;
  readonly isMoreThan: boolean;
}

/** @name ProposalData */
export interface ProposalData extends Enum {
  readonly isHash: boolean;
  readonly asHash: Hash;
  readonly isProposal: boolean;
  readonly asProposal: Bytes;
}

/** @name ProposalState */
export interface ProposalState extends Enum {
  readonly isPending: boolean;
  readonly isCancelled: boolean;
  readonly isKilled: boolean;
  readonly isRejected: boolean;
  readonly isReferendum: boolean;
}

/** @name ProtocolOp */
export interface ProtocolOp extends Enum {
  readonly isAssetRegisterTicker: boolean;
  readonly isAssetIssue: boolean;
  readonly isAssetAddDocuments: boolean;
  readonly isAssetCreateAsset: boolean;
  readonly isDividendNew: boolean;
  readonly isComplianceManagerAddActiveRule: boolean;
  readonly isIdentityRegisterDid: boolean;
  readonly isIdentityCddRegisterDid: boolean;
  readonly isIdentityAddClaim: boolean;
  readonly isIdentitySetMasterKey: boolean;
  readonly isIdentityAddSigningItemsWithAuthorization: boolean;
  readonly isPipsPropose: boolean;
  readonly isVotingAddBallot: boolean;
}

/** @name Referendum */
export interface Referendum extends Struct {
  readonly id: PipId;
  readonly state: ReferendumState;
  readonly referendum_type: ReferendumType;
  readonly enactment_period: u32;
}

/** @name ReferendumState */
export interface ReferendumState extends Enum {
  readonly isPending: boolean;
  readonly isScheduled: boolean;
  readonly isRejected: boolean;
  readonly isFailed: boolean;
  readonly isExecuted: boolean;
}

/** @name ReferendumType */
export interface ReferendumType extends Enum {
  readonly isFastTracked: boolean;
  readonly isEmergency: boolean;
  readonly isCommunity: boolean;
}

/** @name RestrictionResult */
export interface RestrictionResult extends Enum {
  readonly isValid: boolean;
  readonly isInvalid: boolean;
  readonly isForceValid: boolean;
}

/** @name Rule */
export interface Rule extends Struct {
  readonly rule_type: RuleType;
  readonly issuers: Vec<IdentityId>;
}

/** @name RuleResult */
export interface RuleResult extends Struct {
  readonly rule: Rule;
  readonly result: bool;
}

/** @name RuleType */
export interface RuleType extends Enum {
  readonly isIsPresent: boolean;
  readonly asIsPresent: Claim;
  readonly isIsAbsent: boolean;
  readonly asIsAbsent: Claim;
  readonly isIsAnyOf: boolean;
  readonly asIsAnyOf: Vec<Claim>;
  readonly isIsNoneOf: boolean;
  readonly asIsNoneOf: Vec<Claim>;
}

/** @name Scope */
export interface Scope extends IdentityId {}

/** @name SecurityToken */
export interface SecurityToken extends Struct {
  readonly name: AssetName;
  readonly total_supply: Balance;
  readonly owner_did: IdentityId;
  readonly divisible: bool;
  readonly asset_type: AssetType;
  readonly link_id: u64;
}

/** @name Signatory */
export interface Signatory extends Enum {
  readonly isIdentity: boolean;
  readonly asIdentity: IdentityId;
  readonly isAccount: boolean;
  readonly asAccount: AccountKey;
}

/** @name SignatoryType */
export interface SignatoryType extends Enum {
  readonly isExternal: boolean;
  readonly isIdentity: boolean;
  readonly isMultiSig: boolean;
  readonly isRelayer: boolean;
}

/** @name SignData */
export interface SignData extends Struct {
  readonly custodian_did: IdentityId;
  readonly holder_did: IdentityId;
  readonly ticker: Ticker;
  readonly value: Balance;
  readonly nonce: u16;
}

/** @name SigningItem */
export interface SigningItem extends Struct {
  readonly signer: Signatory;
  readonly signer_type: SignatoryType;
  readonly permissions: Vec<Permission>;
}

/** @name SigningItemWithAuth */
export interface SigningItemWithAuth extends Struct {
  readonly signing_item: SigningItem;
  readonly auth_signature: Signature;
}

/** @name SimpleTokenRecord */
export interface SimpleTokenRecord extends Struct {
  readonly ticker: Ticker;
  readonly total_supply: Balance;
  readonly owner_did: IdentityId;
}

/** @name SmartExtension */
export interface SmartExtension extends Struct {
  readonly extension_type: SmartExtensionType;
  readonly extension_name: SmartExtensionName;
  readonly extension_id: IdentityId;
  readonly is_archive: bool;
}

/** @name SmartExtensionName */
export interface SmartExtensionName extends Text {}

/** @name SmartExtensionType */
export interface SmartExtensionType extends Enum {
  readonly isTransferManager: boolean;
  readonly isOfferings: boolean;
  readonly isCustom: boolean;
  readonly asCustom: Bytes;
}

/** @name STO */
export interface STO extends Struct {
  readonly beneficiary_did: IdentityId;
  readonly cap: Balance;
  readonly sold: Balance;
  readonly rate: u64;
  readonly start_date: Moment;
  readonly end_date: Moment;
  readonly active: bool;
}

/** @name TargetIdAuthorization */
export interface TargetIdAuthorization extends Struct {
  readonly target_id: IdentityId;
  readonly nonce: u64;
  readonly expires_at: Moment;
}

/** @name Ticker */
export interface Ticker extends U8aFixed {}

/** @name TickerRegistration */
export interface TickerRegistration extends Struct {
  readonly owner: IdentityId;
  readonly expiry: Option<Moment>;
  readonly link_id: u64;
}

/** @name TickerRegistrationConfig */
export interface TickerRegistrationConfig extends Struct {
  readonly max_ticker_length: u8;
  readonly registration_length: Option<Moment>;
}

/** @name TickerTransferApproval */
export interface TickerTransferApproval extends Struct {
  readonly authorized_by: IdentityId;
  readonly next_ticker: Option<Ticker>;
  readonly previous_ticker: Option<Ticker>;
}

/** @name Url */
export interface Url extends Text {}

/** @name Vote */
export interface Vote extends Enum {
  readonly isNone: boolean;
  readonly isYes: boolean;
  readonly asYes: Balance;
  readonly isNo: boolean;
  readonly asNo: Balance;
}

/** @name VoteByPip */
export interface VoteByPip extends Struct {
  readonly pip: PipId;
  readonly vote: Vote;
}

/** @name VoteCount */
export interface VoteCount extends Enum {
  readonly isProposalFound: boolean;
  readonly asProposalFound: VoteCountProposalFound;
  readonly isProposalNotFound: boolean;
  readonly asProposalNotFound: Bytes;
}

/** @name VoteCountProposalFound */
export interface VoteCountProposalFound extends Struct {
  readonly ayes: u64;
  readonly nays: u64;
}

/** @name VotingResult */
export interface VotingResult extends Struct {
  readonly ayes_count: u32;
  readonly ayes_stake: Balance;
  readonly nays_count: u32;
  readonly nays_stake: Balance;
}

/** @name Weight */
export interface Weight extends u32 {}

export type PHANTOM_POLYMESH = 'polymesh';