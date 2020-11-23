/* eslint-disable quote-props */
/* eslint-disable quotes */

import { DefinitionRpc, DefinitionRpcSub, RegistryTypes } from '@polkadot/types/types';
import { NetworkName } from '@polymathnetwork/extension-core/types';

const alcyone = {
  "types": {
    "IdentityId": "[u8; 32]",
    "InvestorUid": "[u8; 32]",
    "Ticker": "[u8; 12]",
    "CddId": "[u8; 32]",
    "ScopeId": "[u8; 32]",
    "PosRatio": "(u32, u32)",
    "DocumentName": "Text",
    "DocumentUri": "Text",
    "DocumentHash": "Text",
    "Document": {
      "uri": "DocumentUri",
      "content_hash": "DocumentHash"
    },
    "AssetType": {
      "_enum": {
        "EquityCommon": "",
        "EquityPreferred": "",
        "Commodity": "",
        "FixedIncome": "",
        "REIT": "",
        "Fund": "",
        "RevenueShareAgreement": "",
        "StructuredProduct": "",
        "Derivative": "",
        "Custom": "Vec<u8>"
      }
    },
    "AssetIdentifier": {
      "_enum": {
        "CUSIP": "[u8; 9]",
        "CINS": "[u8; 9]",
        "ISIN": "[u8; 12]",
        "LEI": "[u8; 20]"
      }
    },
    "AssetOwnershipRelation": {
      "_enum": {
        "NotOwned": "",
        "TickerOwned": "",
        "AssetOwned": ""
      }
    },
    "AssetName": "Text",
    "FundingRoundName": "Text",
    "VenueDetails": "Text",
    "SecurityToken": {
      "name": "AssetName",
      "total_supply": "Balance",
      "owner_did": "IdentityId",
      "divisible": "bool",
      "asset_type": "AssetType",
      "primary_issuance_agent": "Option<IdentityId>"
    },
    "LinkedKeyInfo": {
      "_enum": {
        "Unique": "IdentityId",
        "Group": "Vec<IdentityId>"
      }
    },
    "Permission": {
      "_enum": [
        "Full",
        "Admin",
        "Operator",
        "SpendFunds"
      ]
    },
    "Signatory": {
      "_enum": {
        "Identity": "IdentityId",
        "Account": "AccountId"
      }
    },
    "SecondaryKey": {
      "signer": "Signatory",
      "permissions": "Vec<Permission>"
    },
    "SecondaryKeyWithAuth": {
      "secondary_key": "SecondaryKey",
      "auth_signature": "Signature"
    },
    "IdentityRole": {
      "_enum": [
        "Issuer",
        "SimpleTokenIssuer",
        "Validator",
        "ClaimIssuer",
        "Investor",
        "NodeRunner",
        "PM",
        "CDDAMLClaimIssuer",
        "AccreditedInvestorClaimIssuer",
        "VerifiedIdentityClaimIssuer"
      ]
    },
    "PreAuthorizedKeyInfo": {
      "target_id": "IdentityId",
      "secondary_key": "SecondaryKey"
    },
    "DidRecord": {
      "roles": "Vec<IdentityRole>",
      "primary_key": "AccountId",
      "secondary_keys": "Vec<SecondaryKey>"
    },
    "KeyIdentityData": {
      "identity": "IdentityId",
      "permissions": "Option<Vec<Permission>>"
    },
    "CountryCode": {
      "_enum": [
        "AF",
        "AX",
        "AL",
        "DZ",
        "AS",
        "AD",
        "AO",
        "AI",
        "AQ",
        "AG",
        "AR",
        "AM",
        "AW",
        "AU",
        "AT",
        "AZ",
        "BS",
        "BH",
        "BD",
        "BB",
        "BY",
        "BE",
        "BZ",
        "BJ",
        "BM",
        "BT",
        "BO",
        "BA",
        "BW",
        "BV",
        "BR",
        "VG",
        "IO",
        "BN",
        "BG",
        "BF",
        "BI",
        "KH",
        "CM",
        "CA",
        "CV",
        "KY",
        "CF",
        "TD",
        "CL",
        "CN",
        "HK",
        "MO",
        "CX",
        "CC",
        "CO",
        "KM",
        "CG",
        "CD",
        "CK",
        "CR",
        "CI",
        "HR",
        "CU",
        "CY",
        "CZ",
        "DK",
        "DJ",
        "DM",
        "DO",
        "EC",
        "EG",
        "SV",
        "GQ",
        "ER",
        "EE",
        "ET",
        "FK",
        "FO",
        "FJ",
        "FI",
        "FR",
        "GF",
        "PF",
        "TF",
        "GA",
        "GM",
        "GE",
        "DE",
        "GH",
        "GI",
        "GR",
        "GL",
        "GD",
        "GP",
        "GU",
        "GT",
        "GG",
        "GN",
        "GW",
        "GY",
        "HT",
        "HM",
        "VA",
        "HN",
        "HU",
        "IS",
        "IN",
        "ID",
        "IR",
        "IQ",
        "IE",
        "IM",
        "IL",
        "IT",
        "JM",
        "JP",
        "JE",
        "JO",
        "KZ",
        "KE",
        "KI",
        "KP",
        "KR",
        "KW",
        "KG",
        "LA",
        "LV",
        "LB",
        "LS",
        "LR",
        "LY",
        "LI",
        "LT",
        "LU",
        "MK",
        "MG",
        "MW",
        "MY",
        "MV",
        "ML",
        "MT",
        "MH",
        "MQ",
        "MR",
        "MU",
        "YT",
        "MX",
        "FM",
        "MD",
        "MC",
        "MN",
        "ME",
        "MS",
        "MA",
        "MZ",
        "MM",
        "NA",
        "NR",
        "NP",
        "NL",
        "AN",
        "NC",
        "NZ",
        "NI",
        "NE",
        "NG",
        "NU",
        "NF",
        "MP",
        "NO",
        "OM",
        "PK",
        "PW",
        "PS",
        "PA",
        "PG",
        "PY",
        "PE",
        "PH",
        "PN",
        "PL",
        "PT",
        "PR",
        "QA",
        "RE",
        "RO",
        "RU",
        "RW",
        "BL",
        "SH",
        "KN",
        "LC",
        "MF",
        "PM",
        "VC",
        "WS",
        "SM",
        "ST",
        "SA",
        "SN",
        "RS",
        "SC",
        "SL",
        "SG",
        "SK",
        "SI",
        "SB",
        "SO",
        "ZA",
        "GS",
        "SS",
        "ES",
        "LK",
        "SD",
        "SR",
        "SJ",
        "SZ",
        "SE",
        "CH",
        "SY",
        "TW",
        "TJ",
        "TZ",
        "TH",
        "TL",
        "TG",
        "TK",
        "TO",
        "TT",
        "TN",
        "TR",
        "TM",
        "TC",
        "TV",
        "UG",
        "UA",
        "AE",
        "GB",
        "US",
        "UM",
        "UY",
        "UZ",
        "VU",
        "VE",
        "VN",
        "VI",
        "WF",
        "EH",
        "YE",
        "ZM",
        "ZW"
      ]
    },
    "Scope": {
      "_enum": {
        "Identity": "IdentityId",
        "Ticker": "Ticker",
        "Custom": "Vec<u8>"
      }
    },
    "InvestorZKProofData": "[u8;64]",
    "Claim": {
      "_enum": {
        "Accredited": "Scope",
        "Affiliate": "Scope",
        "BuyLockup": "Scope",
        "SellLockup": "Scope",
        "CustomerDueDiligence": "CddId",
        "KnowYourCustomer": "Scope",
        "Jurisdiction": "(CountryCode, Scope)",
        "Exempted": "Scope",
        "Blocked": "Scope",
        "InvestorZKProof": "(Scope, ScopeId, CddId, InvestorZKProofData)",
        "NoData": ""
      }
    },
    "ClaimType": {
      "_enum": {
        "Accredited": "",
        "Affiliate": "",
        "BuyLockup": "",
        "SellLockup": "",
        "CustomerDueDiligence": "",
        "KnowYourCustomer": "",
        "Jurisdiction": "",
        "Exempted": "",
        "Blocked": "",
        "NoType": ""
      }
    },
    "IdentityClaim": {
      "claim_issuer": "IdentityId",
      "issuance_date": "Moment",
      "last_update_date": "Moment",
      "expiry": "Option<Moment>",
      "claim": "Claim"
    },
    "IdentityClaimKey": {
      "id": "IdentityId",
      "claim_type": "ClaimType"
    },
    "ComplianceRequirement": {
      "sender_conditions": "Vec<Condition>",
      "receiver_conditions": "Vec<Condition>",
      "id": "u32"
    },
    "ComplianceRequirementResult": {
      "sender_conditions": "Vec<Condition>",
      "receiver_conditions": "Vec<Condition>",
      "id": "u32",
      "result": "bool"
    },
    "ConditionType": {
      "_enum": {
        "IsPresent": "Claim",
        "IsAbsent": "Claim",
        "IsAnyOf": "Vec<Claim>",
        "IsNoneOf": "Vec<Claim>",
        "IsIdentity": "TargetIdentity",
        "HasValidProofOfInvestor": "Ticker"
      }
    },
    "ImplicitRequirementStatus": {
      "_enum": {
        "Active": "",
        "Inactive": ""
      }
    },
    "Condition": {
      "condition_type": "ConditionType",
      "issuers": "Vec<IdentityId>"
    },
    "ConditionResult": {
      "condition": "Condition",
      "result": "bool"
    },
    "STO": {
      "beneficiary_did": "IdentityId",
      "cap": "Balance",
      "sold": "Balance",
      "rate": "u64",
      "start_date": "Moment",
      "end_date": "Moment",
      "active": "bool"
    },
    "Investment": {
      "investor_did": "IdentityId",
      "amount_paid": "Balance",
      "assets_purchased": "Balance",
      "last_purchase_date": "Moment"
    },
    "SimpleTokenRecord": {
      "ticker": "Ticker",
      "total_supply": "Balance",
      "owner_did": "IdentityId"
    },
    "FeeOf": "Balance",
    "Dividend": {
      "amount": "Balance",
      "active": "bool",
      "matures_at": "Option<Moment>",
      "expires_at": "Option<Moment>",
      "payout_currency": "Option<Ticker>",
      "checkpoint_id": "u64"
    },
    "TargetIdAuthorization": {
      "target_id": "IdentityId",
      "nonce": "u64",
      "expires_at": "Moment"
    },
    "TickerRegistration": {
      "owner": "IdentityId",
      "expiry": "Option<Moment>"
    },
    "TickerRegistrationConfig": {
      "max_ticker_length": "u8",
      "registration_length": "Option<Moment>"
    },
    "ClassicTickerRegistration": {
      "eth_owner": "EthereumAddress",
      "is_created": "bool"
    },
    "EthereumAddress": "[u8; 20]",
    "EcdsaSignature": "[u8; 65]",
    "MotionTitle": "Text",
    "MotionInfoLink": "Text",
    "Motion": {
      "title": "MotionTitle",
      "info_link": "MotionInfoLink",
      "choices": "Vec<MotionTitle>"
    },
    "Ballot": {
      "checkpoint_id": "u64",
      "voting_start": "Moment",
      "voting_end": "Moment",
      "motions": "Vec<Motion>"
    },
    "Url": "Text",
    "PipDescription": "Text",
    "PipsMetadata": {
      "proposer": "AccountId",
      "id": "PipId",
      "end": "u32",
      "url": "Option<Url>",
      "description": "Option<PipDescription>",
      "cool_off_until": "u32",
      "beneficiaries": "Vec<Beneficiary>"
    },
    "Beneficiary": {
      "id": "IdentityId",
      "amount": "Balance"
    },
    "DepositInfo": {
      "owner": "AccountId",
      "amount": "Balance"
    },
    "PolymeshVotes": {
      "index": "u32",
      "ayes": "Vec<(IdentityId, Balance)>",
      "nays": "Vec<(IdentityId, Balance)>"
    },
    "PipId": "u32",
    "ProposalState": {
      "_enum": [
        "Pending",
        "Cancelled",
        "Killed",
        "Rejected",
        "Referendum"
      ]
    },
    "ReferendumState": {
      "_enum": [
        "Pending",
        "Scheduled",
        "Rejected",
        "Failed",
        "Executed"
      ]
    },
    "ReferendumType": {
      "_enum": [
        "FastTracked",
        "Emergency",
        "Community"
      ]
    },
    "Pip": {
      "id": "PipId",
      "proposal": "Call",
      "state": "ProposalState"
    },
    "ProposalData": {
      "_enum": {
        "Hash": "Hash",
        "Proposal": "Vec<u8>"
      }
    },
    "Referendum": {
      "id": "PipId",
      "state": "ReferendumState",
      "referendum_type": "ReferendumType",
      "enactment_period": "u32"
    },
    "TickerTransferApproval": {
      "authorized_by": "IdentityId",
      "next_ticker": "Option<Ticker>",
      "previous_ticker": "Option<Ticker>"
    },
    "OffChainSignature": {
      "_enum": {
        "Ed25519": "H512",
        "Sr25519": "H512",
        "Ecdsa": "H512"
      }
    },
    "Authorization": {
      "authorization_data": "AuthorizationData",
      "authorized_by": "IdentityId",
      "expiry": "Option<Moment>",
      "auth_id": "u64"
    },
    "AuthorizationData": {
      "_enum": {
        "AttestPrimaryKeyRotation": "IdentityId",
        "RotatePrimaryKey": "IdentityId",
        "TransferTicker": "Ticker",
        "TransferPrimaryIssuanceAgent": "Ticker",
        "AddMultiSigSigner": "AccountId",
        "TransferAssetOwnership": "Ticker",
        "JoinIdentity": "Vec<Permission>",
        "PortfolioCustody": "PortfolioId",
        "Custom": "Ticker",
        "NoData": ""
      }
    },
    "AuthIdentifier": {
      "signatory": "Signatory",
      "auth_id": "u64"
    },
    "SmartExtensionType": {
      "_enum": {
        "TransferManager": "",
        "Offerings": "",
        "Custom": "Vec<u8>"
      }
    },
    "SmartExtensionName": "Text",
    "SmartExtension": {
      "extension_type": "SmartExtensionType",
      "extension_name": "SmartExtensionName",
      "extension_id": "AccountId",
      "is_archive": "bool"
    },
    "ProportionMatch": {
      "_enum": [
        "AtLeast",
        "MoreThan"
      ]
    },
    "AuthorizationNonce": "u64",
    "Counter": "u64",
    "Commission": {
      "_enum": {
        "Individual": "",
        "Global": "u32"
      }
    },
    "RestrictionResult": {
      "_enum": [
        "Valid",
        "Invalid",
        "ForceValid"
      ]
    },
    "Memo": "[u8;32]",
    "IssueRecipient": {
      "_enum": {
        "Account": "AccountId",
        "Identity": "IdentityId"
      }
    },
    "BridgeTx": {
      "nonce": "u32",
      "recipient": "AccountId",
      "value": "Balance",
      "tx_hash": "H256"
    },
    "PendingTx": {
      "did": "IdentityId",
      "bridge_tx": "BridgeTx"
    },
    "OfflineSlashingParams": {
      "max_offline_percent": "u32",
      "constant": "u32",
      "max_slash_percent": "u32"
    },
    "AssetCompliance": {
      "is_paused": "bool",
      "requirements": "Vec<ComplianceRequirement>"
    },
    "AssetComplianceResult": {
      "paused": "bool",
      "requirements": "Vec<ComplianceRequirementResult>",
      "result": "bool"
    },
    "Claim1stKey": {
      "target": "IdentityId",
      "claim_type": "ClaimType"
    },
    "Claim2ndKey": {
      "issuer": "IdentityId",
      "scope": "Option<Scope>"
    },
    "BatchAddClaimItem": {
      "target": "IdentityId",
      "claim": "Claim",
      "expiry": "Option<Moment>"
    },
    "BatchRevokeClaimItem": {
      "target": "IdentityId",
      "claim": "Claim"
    },
    "InactiveMember": {
      "id": "IdentityId",
      "deactivated_at": "Moment",
      "expiry": "Option<Moment>"
    },
    "VotingResult": {
      "ayes_count": "u32",
      "ayes_stake": "Balance",
      "nays_count": "u32",
      "nays_stake": "Balance"
    },
    "ProtocolOp": {
      "_enum": [
        "AssetRegisterTicker",
        "AssetIssue",
        "AssetAddDocument",
        "AssetCreateAsset",
        "DividendNew",
        "ComplianceManagerAddComplianceRequirement",
        "IdentityRegisterDid",
        "IdentityCddRegisterDid",
        "IdentityAddClaim",
        "IdentitySetPrimaryKey",
        "IdentityAddSecondaryKeysWithAuthorization",
        "PipsPropose",
        "VotingAddBallot"
      ]
    },
    "CddStatus": {
      "_enum": {
        "Ok": "IdentityId",
        "Err": "Vec<u8>"
      }
    },
    "AssetDidResult": {
      "_enum": {
        "Ok": "IdentityId",
        "Err": "Vec<u8>"
      }
    },
    "DidRecordsSuccess": {
      "primary_key": "AccountId",
      "secondary_key": "Vec<SecondaryKey>"
    },
    "DidRecords": {
      "_enum": {
        "Success": "DidRecordsSuccess",
        "IdNotFound": "Vec<u8>"
      }
    },
    "VoteCountProposalFound": {
      "ayes": "u64",
      "nays": "u64"
    },
    "VoteCount": {
      "_enum": {
        "ProposalFound": "VoteCountProposalFound",
        "ProposalNotFound": "Vec<u8>"
      }
    },
    "Vote": "(bool, Balance)",
    "VoteByPip": {
      "pip": "PipId",
      "vote": "Vote"
    },
    "HistoricalVotingByAddress": "Vec<VoteByPip>",
    "HistoricalVotingById": "Vec<(AccountId, HistoricalVotingByAddress)>",
    "BridgeTxDetail": {
      "amount": "Balance",
      "status": "BridgeTxStatus",
      "execution_block": "BlockNumber",
      "tx_hash": "H256"
    },
    "BridgeTxStatus": {
      "_enum": {
        "Absent": "",
        "Pending": "u8",
        "Frozen": "",
        "Timelocked": "",
        "Handled": ""
      }
    },
    "HandledTxStatus": {
      "_enum": {
        "Success": "",
        "Error": "Text"
      }
    },
    "CappedFee": "u64",
    "CanTransferResult": {
      "_enum": {
        "Ok": "u8",
        "Err": "Vec<u8>"
      }
    },
    "AuthorizationType": {
      "_enum": {
        "AttestPrimaryKeyRotation": "",
        "RotatePrimaryKey": "",
        "TransferTicker": "",
        "AddMultiSigSigner": "",
        "TransferAssetOwnership": "",
        "JoinIdentity": "",
        "PortfolioCustody": "",
        "Custom": "",
        "NoData": ""
      }
    },
    "ProposalDetails": {
      "approvals": "u64",
      "rejections": "u64",
      "status": "ProposalStatus",
      "expiry": "Option<Moment>",
      "auto_close": "bool"
    },
    "ProposalStatus": {
      "_enum": {
        "Invalid": "",
        "ActiveOrExpired": "",
        "ExecutionSuccessful": "",
        "ExecutionFailed": "",
        "Rejected": ""
      }
    },
    "DidStatus": {
      "_enum": {
        "Unknown": "",
        "Exists": "",
        "CddVerified": ""
      }
    },
    "IssueAssetItem": {
      "identity_did": "IdentityId",
      "value": "Balance"
    },
    "PortfolioName": "Vec<u8>",
    "PortfolioNumber": "u64",
    "PortfolioKind": {
      "_enum": {
        "Default": "",
        "User": "PortfolioNumber"
      }
    },
    "PortfolioId": {
      "did": "IdentityId",
      "kind": "PortfolioKind"
    },
    "ProverTickerKey": {
      "prover": "IdentityId",
      "ticker": "Ticker"
    },
    "TickerRangeProof": {
      "initial_message": "[u8; 32]",
      "final_response": "Vec<u8>",
      "max_two_exp": "u32"
    },
    "InstructionStatus": {
      "_enum": {
        "Unknown": "",
        "Pending": ""
      }
    },
    "LegStatus": {
      "_enum": {
        "PendingTokenLock": "",
        "ExecutionPending": "",
        "ExecutionToBeSkipped": "(AccountId, u64)"
      }
    },
    "AuthorizationStatus": {
      "_enum": {
        "Unknown": "",
        "Pending": "",
        "Authorized": "",
        "Rejected": ""
      }
    },
    "SettlementType": {
      "_enum": {
        "SettleOnAuthorization": "",
        "SettleOnBlock": "BlockNumber"
      }
    },
    "Instruction": {
      "instruction_id": "u64",
      "venue_id": "u64",
      "status": "InstructionStatus",
      "settlement_type": "SettlementType",
      "created_at": "Option<Moment>",
      "valid_from": "Option<Moment>"
    },
    "Leg": {
      "from": "PortfolioId",
      "to": "PortfolioId",
      "asset": "Ticker",
      "amount": "Balance"
    },
    "Venue": {
      "creator": "IdentityId",
      "instructions": "Vec<u64>",
      "details": "Vec<u8>",
      "venue_type": "VenueType"
    },
    "Receipt": {
      "receipt_uid": "u64",
      "from": "PortfolioId",
      "to": "PortfolioId",
      "asset": "Ticker",
      "amount": "Balance"
    },
    "ReceiptDetails": {
      "receipt_uid": "u64",
      "leg_id": "u64",
      "signer": "AccountId",
      "signature": "OffChainSignature"
    },
    "UniqueCall": {
      "nonce": "u64",
      "call": "Call"
    },
    "MovePortfolioItem": {
      "ticker": "Ticker",
      "amount": "Balance"
    },
    "WeightToFeeCoefficient": {
      "coeffInteger": "Balance",
      "coeffFrac": "Perbill",
      "negative": "bool",
      "degree": "u8"
    },
    "TargetIdentity": {
      "_enum": {
        "PrimaryIssuanceAgent": "",
        "Specific": "IdentityId"
      }
    },
    "Fundraiser": {
      "raise_token": "Ticker",
      "remaining_amount": "Balance",
      "price_per_token": "Balance",
      "venue_id": "u64"
    },
    "VenueType": {
      "_enum": [
        "Other",
        "Distribution",
        "Sto",
        "Exchange"
      ]
    }
  },
  "rpc": {
    "compliance": {
      "canTransfer": {
        "description": "Checks whether a transaction with given parameters is compliant to the compliance manager conditions",
        "params": [
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "from_did",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "to_did",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "primary_issuance_agent",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "AssetComplianceResult"
      }
    },
    "identity": {
      "isIdentityHasValidCdd": {
        "description": "use to tell whether the given did has valid cdd claim or not",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "buffer_time",
            "type": "u64",
            "isOptional": true
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CddStatus"
      },
      "getAssetDid": {
        "description": "function is used to query the given ticker DID",
        "params": [
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "AssetDidResult"
      },
      "getDidRecords": {
        "description": "Used to get the did record values for a given DID",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "DidRecords"
      },
      "getDidStatus": {
        "description": "Retrieve status of the DID",
        "params": [
          {
            "name": "did",
            "type": "Vec<IdentityId>",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<DidStatus>"
      },
      "getFilteredAuthorizations": {
        "description": "Retrieve authorizations data for a given signatory and filtered using the given authorization type",
        "params": [
          {
            "name": "signatory",
            "type": "Signatory",
            "isOptional": false
          },
          {
            "name": "allow_expired",
            "type": "bool",
            "isOptional": false
          },
          {
            "name": "auth_type",
            "type": "AuthorizationType",
            "isOptional": true
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<Authorization>"
      },
      "getKeyIdentityData": {
        "description": "Query relation between a signing key and a DID",
        "params": [
          {
            "name": "acc",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Option<KeyIdentityData<IdentityId>>"
      }
    },
    "pips": {
      "getVotes": {
        "description": "Summary of votes of a proposal given by index",
        "params": [
          {
            "name": "index",
            "type": "u32",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "VoteCount"
      },
      "proposedBy": {
        "description": "Retrieves proposal indices started by address",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<u32>"
      },
      "votedOn": {
        "description": "Retrieves proposal address indices voted on",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<u32>"
      },
      "votingHistoryByAddress": {
        "description": "Retrieves proposal `address` indices voted on",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "HistoricalVoting"
      },
      "votingHistoryById": {
        "description": "Retrieve historical voting of `id` identity",
        "params": [
          {
            "name": "id",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "HistoricalVotingByAddress"
      }
    },
    "protocolFee": {
      "computeFee": {
        "description": "Gets the fee of a chargeable extrinsic operation",
        "params": [
          {
            "name": "op",
            "type": "ProtocolOp",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CappedFee"
      }
    },
    "staking": {
      "getCurve": {
        "description": "Retrieves curves parameters",
        "params": [
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<(Perbill, Perbill)>"
      }
    },
    "asset": {
      "canTransfer": {
        "description": "Checks whether a transaction with given parameters can take place or not",
        "params": [
          {
            "name": "sender",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "from_custodian",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "from_portfolio",
            "type": "PortfolioId",
            "isOptional": false
          },
          {
            "name": "to_custodian",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "to_portfolio",
            "type": "PortfolioId",
            "isOptional": false
          },
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "value",
            "type": "Balance",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CanTransferResult"
      }
    },
    "portfolio": {
      "getPortfolios": {
        "description": "Gets all user-defined portfolio names of an identity",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          }
        ],
        "type": "GetPortfoliosResult"
      },
      "getPortfolioAssets": {
        "description": "Gets the balances of all assets in a given portfolio",
        "params": [
          {
            "name": "portfolio_id",
            "type": "PortfolioId",
            "isOptional": false
          }
        ],
        "type": "GetPortfolioAssetsResult"
      }
    }
  }
};

const pme = {
  "types": {
    "IdentityId": "[u8; 32]",
    "EventDid": "IdentityId",
    "InvestorUid": "[u8; 16]",
    "Ticker": "[u8; 12]",
    "CddId": "[u8; 32]",
    "ScopeId": "[u8; 32]",
    "PosRatio": "(u32, u32)",
    "DocumentId": "u32",
    "DocumentName": "Text",
    "DocumentUri": "Text",
    "DocumentHash": "Text",
    "DocumentType": "Text",
    "Document": {
      "uri": "DocumentUri",
      "content_hash": "DocumentHash",
      "name": "DocumentName",
      "doc_type": "Option<DocumentType>",
      "filing_date": "Option<Moment>"
    },
    "AssetType": {
      "_enum": {
        "EquityCommon": "",
        "EquityPreferred": "",
        "Commodity": "",
        "FixedIncome": "",
        "REIT": "",
        "Fund": "",
        "RevenueShareAgreement": "",
        "StructuredProduct": "",
        "Derivative": "",
        "Custom": "Vec<u8>"
      }
    },
    "AssetIdentifier": {
      "_enum": {
        "CUSIP": "[u8; 9]",
        "CINS": "[u8; 9]",
        "ISIN": "[u8; 12]",
        "LEI": "[u8; 20]"
      }
    },
    "AssetOwnershipRelation": {
      "_enum": {
        "NotOwned": "",
        "TickerOwned": "",
        "AssetOwned": ""
      }
    },
    "AssetName": "Text",
    "FundingRoundName": "Text",
    "VenueDetails": "Text",
    "SecurityToken": {
      "name": "AssetName",
      "total_supply": "Balance",
      "owner_did": "IdentityId",
      "divisible": "bool",
      "asset_type": "AssetType",
      "primary_issuance_agent": "Option<IdentityId>"
    },
    "PalletName": "Text",
    "DispatchableName": "Text",
    "PalletPermissions": {
      "pallet_name": "PalletName",
      "dispatchable_names": "Option<Vec<DispatchableName>>"
    },
    "Permissions": {
      "asset": "Option<Vec<Ticker>>",
      "extrinsic": "Option<Vec<PalletPermissions>>",
      "portfolio": "Option<Vec<PortfolioId>>"
    },
    "LegacyPalletPermissions": {
      "pallet_name": "PalletName",
      "total": "bool",
      "dispatchable_names": "Vec<DispatchableName>"
    },
    "LegacyPermissions": {
      "asset": "Option<Vec<Ticker>>",
      "extrinsic": "Option<Vec<LegacyPalletPermissions>>",
      "portfolio": "Option<Vec<PortfolioId>>"
    },
    "Signatory": {
      "_enum": {
        "Identity": "IdentityId",
        "Account": "AccountId"
      }
    },
    "SecondaryKey": {
      "signer": "Signatory",
      "permissions": "Permissions"
    },
    "SecondaryKeyWithAuth": {
      "secondary_key": "SecondaryKey",
      "auth_signature": "Signature"
    },
    "IdentityRole": {
      "_enum": [
        "Issuer",
        "SimpleTokenIssuer",
        "Validator",
        "ClaimIssuer",
        "Investor",
        "NodeRunner",
        "PM",
        "CDDAMLClaimIssuer",
        "AccreditedInvestorClaimIssuer",
        "VerifiedIdentityClaimIssuer"
      ]
    },
    "PreAuthorizedKeyInfo": {
      "target_id": "IdentityId",
      "secondary_key": "SecondaryKey"
    },
    "DidRecord": {
      "primary_key": "AccountId",
      "secondary_keys": "Vec<SecondaryKey>"
    },
    "KeyIdentityData": {
      "identity": "IdentityId",
      "permissions": "Option<Permissions>"
    },
    "CountryCode": {
      "_enum": [
        "AF",
        "AX",
        "AL",
        "DZ",
        "AS",
        "AD",
        "AO",
        "AI",
        "AQ",
        "AG",
        "AR",
        "AM",
        "AW",
        "AU",
        "AT",
        "AZ",
        "BS",
        "BH",
        "BD",
        "BB",
        "BY",
        "BE",
        "BZ",
        "BJ",
        "BM",
        "BT",
        "BO",
        "BA",
        "BW",
        "BV",
        "BR",
        "VG",
        "IO",
        "BN",
        "BG",
        "BF",
        "BI",
        "KH",
        "CM",
        "CA",
        "CV",
        "KY",
        "CF",
        "TD",
        "CL",
        "CN",
        "HK",
        "MO",
        "CX",
        "CC",
        "CO",
        "KM",
        "CG",
        "CD",
        "CK",
        "CR",
        "CI",
        "HR",
        "CU",
        "CY",
        "CZ",
        "DK",
        "DJ",
        "DM",
        "DO",
        "EC",
        "EG",
        "SV",
        "GQ",
        "ER",
        "EE",
        "ET",
        "FK",
        "FO",
        "FJ",
        "FI",
        "FR",
        "GF",
        "PF",
        "TF",
        "GA",
        "GM",
        "GE",
        "DE",
        "GH",
        "GI",
        "GR",
        "GL",
        "GD",
        "GP",
        "GU",
        "GT",
        "GG",
        "GN",
        "GW",
        "GY",
        "HT",
        "HM",
        "VA",
        "HN",
        "HU",
        "IS",
        "IN",
        "ID",
        "IR",
        "IQ",
        "IE",
        "IM",
        "IL",
        "IT",
        "JM",
        "JP",
        "JE",
        "JO",
        "KZ",
        "KE",
        "KI",
        "KP",
        "KR",
        "KW",
        "KG",
        "LA",
        "LV",
        "LB",
        "LS",
        "LR",
        "LY",
        "LI",
        "LT",
        "LU",
        "MK",
        "MG",
        "MW",
        "MY",
        "MV",
        "ML",
        "MT",
        "MH",
        "MQ",
        "MR",
        "MU",
        "YT",
        "MX",
        "FM",
        "MD",
        "MC",
        "MN",
        "ME",
        "MS",
        "MA",
        "MZ",
        "MM",
        "NA",
        "NR",
        "NP",
        "NL",
        "AN",
        "NC",
        "NZ",
        "NI",
        "NE",
        "NG",
        "NU",
        "NF",
        "MP",
        "NO",
        "OM",
        "PK",
        "PW",
        "PS",
        "PA",
        "PG",
        "PY",
        "PE",
        "PH",
        "PN",
        "PL",
        "PT",
        "PR",
        "QA",
        "RE",
        "RO",
        "RU",
        "RW",
        "BL",
        "SH",
        "KN",
        "LC",
        "MF",
        "PM",
        "VC",
        "WS",
        "SM",
        "ST",
        "SA",
        "SN",
        "RS",
        "SC",
        "SL",
        "SG",
        "SK",
        "SI",
        "SB",
        "SO",
        "ZA",
        "GS",
        "SS",
        "ES",
        "LK",
        "SD",
        "SR",
        "SJ",
        "SZ",
        "SE",
        "CH",
        "SY",
        "TW",
        "TJ",
        "TZ",
        "TH",
        "TL",
        "TG",
        "TK",
        "TO",
        "TT",
        "TN",
        "TR",
        "TM",
        "TC",
        "TV",
        "UG",
        "UA",
        "AE",
        "GB",
        "US",
        "UM",
        "UY",
        "UZ",
        "VU",
        "VE",
        "VN",
        "VI",
        "WF",
        "EH",
        "YE",
        "ZM",
        "ZW"
      ]
    },
    "Scope": {
      "_enum": {
        "Identity": "IdentityId",
        "Ticker": "Ticker",
        "Custom": "Vec<u8>"
      }
    },
    "InvestorZKProofData": "[u8;64]",
    "Claim": {
      "_enum": {
        "Accredited": "Scope",
        "Affiliate": "Scope",
        "BuyLockup": "Scope",
        "SellLockup": "Scope",
        "CustomerDueDiligence": "CddId",
        "KnowYourCustomer": "Scope",
        "Jurisdiction": "(CountryCode, Scope)",
        "Exempted": "Scope",
        "Blocked": "Scope",
        "InvestorUniqueness": "(Scope, ScopeId, CddId)",
        "NoData": ""
      }
    },
    "ClaimType": {
      "_enum": {
        "Accredited": "",
        "Affiliate": "",
        "BuyLockup": "",
        "SellLockup": "",
        "CustomerDueDiligence": "",
        "KnowYourCustomer": "",
        "Jurisdiction": "",
        "Exempted": "",
        "Blocked": "",
        "InvestorUniqueness": "",
        "NoData": ""
      }
    },
    "IdentityClaim": {
      "claim_issuer": "IdentityId",
      "issuance_date": "Moment",
      "last_update_date": "Moment",
      "expiry": "Option<Moment>",
      "claim": "Claim"
    },
    "IdentityClaimKey": {
      "id": "IdentityId",
      "claim_type": "ClaimType"
    },
    "ComplianceRequirement": {
      "sender_conditions": "Vec<Condition>",
      "receiver_conditions": "Vec<Condition>",
      "id": "u32"
    },
    "ComplianceRequirementResult": {
      "sender_conditions": "Vec<ConditionResult>",
      "receiver_conditions": "Vec<ConditionResult>",
      "id": "u32",
      "result": "bool"
    },
    "ConditionType": {
      "_enum": {
        "IsPresent": "Claim",
        "IsAbsent": "Claim",
        "IsAnyOf": "Vec<Claim>",
        "IsNoneOf": "Vec<Claim>",
        "IsIdentity": "TargetIdentity"
      }
    },
    "TrustedFor": {
      "_enum": {
        "Any": "",
        "Specific": "Vec<ClaimType>"
      }
    },
    "TrustedIssuer": {
      "issuer": "IdentityId",
      "trusted_for": "TrustedFor"
    },
    "Condition": {
      "condition_type": "ConditionType",
      "issuers": "Vec<TrustedIssuer>"
    },
    "ConditionResult": {
      "condition": "Condition",
      "result": "bool"
    },
    "STO": {
      "beneficiary_did": "IdentityId",
      "cap": "Balance",
      "sold": "Balance",
      "rate": "u64",
      "start_date": "Moment",
      "end_date": "Moment",
      "active": "bool"
    },
    "Investment": {
      "investor_did": "IdentityId",
      "amount_paid": "Balance",
      "assets_purchased": "Balance",
      "last_purchase_date": "Moment"
    },
    "SimpleTokenRecord": {
      "ticker": "Ticker",
      "total_supply": "Balance",
      "owner_did": "IdentityId"
    },
    "FeeOf": "Balance",
    "Dividend": {
      "amount": "Balance",
      "active": "bool",
      "matures_at": "Option<Moment>",
      "expires_at": "Option<Moment>",
      "payout_currency": "Option<Ticker>",
      "checkpoint_id": "u64"
    },
    "TargetIdAuthorization": {
      "target_id": "IdentityId",
      "nonce": "u64",
      "expires_at": "Moment"
    },
    "TickerRegistration": {
      "owner": "IdentityId",
      "expiry": "Option<Moment>"
    },
    "TickerRegistrationConfig": {
      "max_ticker_length": "u8",
      "registration_length": "Option<Moment>"
    },
    "ClassicTickerRegistration": {
      "eth_owner": "EthereumAddress",
      "is_created": "bool"
    },
    "ClassicTickerImport": {
      "eth_owner": "EthereumAddress",
      "ticker": "Ticker",
      "is_contract": "bool",
      "is_created": "bool"
    },
    "EthereumAddress": "[u8; 20]",
    "EcdsaSignature": "[u8; 65]",
    "MotionTitle": "Text",
    "MotionInfoLink": "Text",
    "ChoiceTitle": "Text",
    "Motion": {
      "title": "MotionTitle",
      "info_link": "MotionInfoLink",
      "choices": "Vec<ChoiceTitle>"
    },
    "Ballot": {
      "checkpoint_id": "u64",
      "voting_start": "Moment",
      "voting_end": "Moment",
      "motions": "Vec<Motion>"
    },
    "BallotTitle": "Text",
    "BallotMeta": {
      "title": "BallotTitle",
      "motions": "Vec<Motion>"
    },
    "BallotTimeRange": {
      "start": "Moment",
      "end": "Moment"
    },
    "BallotVote": {
      "power": "Balance",
      "fallback": "Option<u16>"
    },
    "MaybeBlock": {
      "_enum": {
        "Some": "BlockNumber",
        "None": ""
      }
    },
    "Url": "Text",
    "PipDescription": "Text",
    "PipsMetadata": {
      "id": "PipId",
      "url": "Option<Url>",
      "description": "Option<PipDescription>",
      "created_at": "BlockNumber",
      "transaction_version": "u32",
      "expiry": "MaybeBlock"
    },
    "Proposer": {
      "_enum": {
        "Community": "AccountId",
        "Committee": "Committee"
      }
    },
    "Committee": {
      "_enum": {
        "Technical": "",
        "Upgrade": ""
      }
    },
    "SkippedCount": "u8",
    "SnapshottedPip": {
      "id": "PipId",
      "weight": "(bool, Balance)"
    },
    "SnapshotId": "u32",
    "SnapshotMetadata": {
      "created_at": "BlockNumber",
      "made_by": "AccountId",
      "id": "SnapshotId"
    },
    "SnapshotResult": {
      "_enum": {
        "Approve": "",
        "Reject": "",
        "Skip": ""
      }
    },
    "Beneficiary": {
      "id": "IdentityId",
      "amount": "Balance"
    },
    "DepositInfo": {
      "owner": "AccountId",
      "amount": "Balance"
    },
    "PolymeshVotes": {
      "index": "u32",
      "ayes": "Vec<(IdentityId, Balance)>",
      "nays": "Vec<(IdentityId, Balance)>",
      "end": "BlockNumber",
      "expiry": "MaybeBlock"
    },
    "PipId": "u32",
    "ProposalState": {
      "_enum": [
        "Pending",
        "Cancelled",
        "Rejected",
        "Scheduled",
        "Failed",
        "Executed",
        "Expired"
      ]
    },
    "ReferendumState": {
      "_enum": [
        "Pending",
        "Scheduled",
        "Rejected",
        "Failed",
        "Executed"
      ]
    },
    "ReferendumType": {
      "_enum": [
        "FastTracked",
        "Emergency",
        "Community"
      ]
    },
    "Pip": {
      "id": "PipId",
      "proposal": "Call",
      "state": "ProposalState",
      "proposer": "Proposer",
      "cool_off_until": "u32"
    },
    "ProposalData": {
      "_enum": {
        "Hash": "Hash",
        "Proposal": "Vec<u8>"
      }
    },
    "Referendum": {
      "id": "PipId",
      "state": "ReferendumState",
      "referendum_type": "ReferendumType",
      "enactment_period": "u32"
    },
    "TickerTransferApproval": {
      "authorized_by": "IdentityId",
      "next_ticker": "Option<Ticker>",
      "previous_ticker": "Option<Ticker>"
    },
    "OffChainSignature": {
      "_enum": {
        "Ed25519": "H512",
        "Sr25519": "H512",
        "Ecdsa": "H512"
      }
    },
    "Authorization": {
      "authorization_data": "AuthorizationData",
      "authorized_by": "IdentityId",
      "expiry": "Option<Moment>",
      "auth_id": "u64"
    },
    "AuthorizationData": {
      "_enum": {
        "AttestPrimaryKeyRotation": "IdentityId",
        "RotatePrimaryKey": "IdentityId",
        "TransferTicker": "Ticker",
        "TransferPrimaryIssuanceAgent": "Ticker",
        "AddMultiSigSigner": "AccountId",
        "TransferAssetOwnership": "Ticker",
        "JoinIdentity": "Permissions",
        "PortfolioCustody": "PortfolioId",
        "Custom": "Ticker",
        "NoData": "",
        "TransferCorporateActionAgent": "Ticker"
      }
    },
    "AuthIdentifier": {
      "signatory": "Signatory",
      "auth_id": "u64"
    },
    "SmartExtensionType": {
      "_enum": {
        "TransferManager": "",
        "Offerings": "",
        "SmartWallet": "",
        "Custom": "Vec<u8>"
      }
    },
    "SmartExtensionName": "Text",
    "SmartExtension": {
      "extension_type": "SmartExtensionType",
      "extension_name": "SmartExtensionName",
      "extension_id": "AccountId",
      "is_archive": "bool"
    },
    "MetaUrl": "Text",
    "MetaDescription": "Text",
    "MetaVersion": "u32",
    "ExtVersion": "u32",
    "TemplateMetadata": {
      "url": "Option<MetaUrl>",
      "se_type": "SmartExtensionType",
      "usage_fee": "Balance",
      "description": "MetaDescription",
      "version": "MetaVersion"
    },
    "TemplateDetails": {
      "instantiation_fee": "Balance",
      "owner": "IdentityId",
      "frozen": "bool"
    },
    "ProportionMatch": {
      "_enum": [
        "AtLeast",
        "MoreThan"
      ]
    },
    "AuthorizationNonce": "u64",
    "Counter": "u64",
    "Commission": {
      "_enum": {
        "Individual": "",
        "Global": "u32"
      }
    },
    "RestrictionResult": {
      "_enum": [
        "Valid",
        "Invalid",
        "ForceValid"
      ]
    },
    "Memo": "[u8;32]",
    "IssueRecipient": {
      "_enum": {
        "Account": "AccountId",
        "Identity": "IdentityId"
      }
    },
    "BridgeTx": {
      "nonce": "u32",
      "recipient": "AccountId",
      "value": "Balance",
      "tx_hash": "H256"
    },
    "PendingTx": {
      "did": "IdentityId",
      "bridge_tx": "BridgeTx"
    },
    "OfflineSlashingParams": {
      "max_offline_percent": "u32",
      "constant": "u32",
      "max_slash_percent": "u32"
    },
    "AssetCompliance": {
      "is_paused": "bool",
      "requirements": "Vec<ComplianceRequirement>"
    },
    "AssetComplianceResult": {
      "paused": "bool",
      "requirements": "Vec<ComplianceRequirementResult>",
      "result": "bool"
    },
    "Claim1stKey": {
      "target": "IdentityId",
      "claim_type": "ClaimType"
    },
    "Claim2ndKey": {
      "issuer": "IdentityId",
      "scope": "Option<Scope>"
    },
    "BatchAddClaimItem": {
      "target": "IdentityId",
      "claim": "Claim",
      "expiry": "Option<Moment>"
    },
    "BatchRevokeClaimItem": {
      "target": "IdentityId",
      "claim": "Claim"
    },
    "InactiveMember": {
      "id": "IdentityId",
      "deactivated_at": "Moment",
      "expiry": "Option<Moment>"
    },
    "VotingResult": {
      "ayes_count": "u32",
      "ayes_stake": "Balance",
      "nays_count": "u32",
      "nays_stake": "Balance"
    },
    "ProtocolOp": {
      "_enum": [
        "AssetRegisterTicker",
        "AssetIssue",
        "AssetAddDocument",
        "AssetCheckpoint",
        "AssetCreateAsset",
        "DividendNew",
        "ComplianceManagerAddComplianceRequirement",
        "IdentityRegisterDid",
        "IdentityCddRegisterDid",
        "IdentityAddClaim",
        "IdentitySetPrimaryKey",
        "IdentityAddSecondaryKeysWithAuthorization",
        "PipsPropose",
        "VotingAddBallot"
      ]
    },
    "CddStatus": {
      "_enum": {
        "Ok": "IdentityId",
        "Err": "Vec<u8>"
      }
    },
    "AssetDidResult": {
      "_enum": {
        "Ok": "IdentityId",
        "Err": "Vec<u8>"
      }
    },
    "DidRecordsSuccess": {
      "primary_key": "AccountId",
      "secondary_key": "Vec<SecondaryKey>"
    },
    "DidRecords": {
      "_enum": {
        "Success": "DidRecordsSuccess",
        "IdNotFound": "Vec<u8>"
      }
    },
    "VoteCountProposalFound": {
      "ayes": "u64",
      "nays": "u64"
    },
    "VoteCount": {
      "_enum": {
        "ProposalFound": "VoteCountProposalFound",
        "ProposalNotFound": "Vec<u8>"
      }
    },
    "Vote": "(bool, Balance)",
    "VoteByPip": {
      "pip": "PipId",
      "vote": "Vote"
    },
    "HistoricalVotingByAddress": "Vec<VoteByPip>",
    "HistoricalVotingById": "Vec<(AccountId, HistoricalVotingByAddress)>",
    "BridgeTxDetail": {
      "amount": "Balance",
      "status": "BridgeTxStatus",
      "execution_block": "BlockNumber",
      "tx_hash": "H256"
    },
    "BridgeTxStatus": {
      "_enum": {
        "Absent": "",
        "Pending": "u8",
        "Frozen": "",
        "Timelocked": "",
        "Handled": ""
      }
    },
    "CappedFee": "u64",
    "CanTransferResult": {
      "_enum": {
        "Ok": "u8",
        "Err": "Vec<u8>"
      }
    },
    "AuthorizationType": {
      "_enum": {
        "AttestPrimaryKeyRotation": "",
        "RotatePrimaryKey": "",
        "TransferTicker": "",
        "TransferPrimaryIssuanceAgent": "",
        "AddMultiSigSigner": "",
        "TransferAssetOwnership": "",
        "JoinIdentity": "",
        "PortfolioCustody": "",
        "Custom": "",
        "NoData": "",
        "TransferCorporateActionAgent": ""
      }
    },
    "ProposalDetails": {
      "approvals": "u64",
      "rejections": "u64",
      "status": "ProposalStatus",
      "expiry": "Option<Moment>",
      "auto_close": "bool"
    },
    "ProposalStatus": {
      "_enum": {
        "Invalid": "",
        "ActiveOrExpired": "",
        "ExecutionSuccessful": "",
        "ExecutionFailed": "",
        "Rejected": ""
      }
    },
    "DidStatus": {
      "_enum": {
        "Unknown": "",
        "Exists": "",
        "CddVerified": ""
      }
    },
    "IssueAssetItem": {
      "identity_did": "IdentityId",
      "value": "Balance"
    },
    "PortfolioName": "Text",
    "PortfolioNumber": "u64",
    "PortfolioKind": {
      "_enum": {
        "Default": "",
        "User": "PortfolioNumber"
      }
    },
    "PortfolioId": {
      "did": "IdentityId",
      "kind": "PortfolioKind"
    },
    "ProverTickerKey": {
      "prover": "IdentityId",
      "ticker": "Ticker"
    },
    "TickerRangeProof": {
      "initial_message": "[u8; 32]",
      "final_response": "Vec<u8>",
      "max_two_exp": "u32"
    },
    "Moment": "u64",
    "CalendarUnit": {
      "_enum": [
        "Second",
        "Minute",
        "Hour",
        "Day",
        "Week",
        "Month",
        "Year"
      ]
    },
    "CalendarPeriod": {
      "unit": "CalendarUnit",
      "amount": "Option<NonZeroU64>"
    },
    "CheckpointSchedule": {
      "start": "Moment",
      "period": "CalendarPeriod"
    },
    "CheckpointId": "u64",
    "ScheduleId": "u64",
    "StoredSchedule": {
      "schedule": "CheckpointSchedule",
      "id": "ScheduleId",
      "at": "Moment"
    },
    "ScheduleSpec": {
      "start": "Option<Moment>",
      "period": "CalendarPeriod"
    },
    "InstructionStatus": {
      "_enum": {
        "Unknown": "",
        "Pending": ""
      }
    },
    "LegStatus": {
      "_enum": {
        "PendingTokenLock": "",
        "ExecutionPending": "",
        "ExecutionToBeSkipped": "(AccountId, u64)"
      }
    },
    "AffirmationStatus": {
      "_enum": {
        "Unknown": "",
        "Pending": "",
        "Affirmed": "",
        "Rejected": ""
      }
    },
    "SettlementType": {
      "_enum": {
        "SettleOnAffirmation": "",
        "SettleOnBlock": "BlockNumber"
      }
    },
    "Instruction": {
      "instruction_id": "u64",
      "venue_id": "u64",
      "status": "InstructionStatus",
      "settlement_type": "SettlementType",
      "created_at": "Option<Moment>",
      "valid_from": "Option<Moment>"
    },
    "Leg": {
      "from": "PortfolioId",
      "to": "PortfolioId",
      "asset": "Ticker",
      "amount": "Balance"
    },
    "Venue": {
      "creator": "IdentityId",
      "instructions": "Vec<u64>",
      "details": "VenueDetails",
      "venue_type": "VenueType"
    },
    "Receipt": {
      "receipt_uid": "u64",
      "from": "PortfolioId",
      "to": "PortfolioId",
      "asset": "Ticker",
      "amount": "Balance"
    },
    "ReceiptMetadata": "Text",
    "ReceiptDetails": {
      "receipt_uid": "u64",
      "leg_id": "u64",
      "signer": "AccountId",
      "signature": "OffChainSignature",
      "metadata": "ReceiptMetadata"
    },
    "UniqueCall": {
      "nonce": "u64",
      "call": "Call"
    },
    "MovePortfolioItem": {
      "ticker": "Ticker",
      "amount": "Balance"
    },
    "WeightToFeeCoefficient": {
      "coeffInteger": "Balance",
      "coeffFrac": "Perbill",
      "negative": "bool",
      "degree": "u8"
    },
    "TargetIdentity": {
      "_enum": {
        "PrimaryIssuanceAgent": "",
        "Specific": "IdentityId"
      }
    },
    "Fundraiser": {
      "raise_token": "Ticker",
      "remaining_amount": "Balance",
      "price_per_token": "Balance",
      "venue_id": "u64"
    },
    "VenueType": {
      "_enum": [
        "Other",
        "Distribution",
        "Sto",
        "Exchange"
      ]
    },
    "Payload": {
      "block_number": "BlockNumber",
      "nominators": "Vec<AccountId>",
      "public": "H256"
    },
    "ExtensionAttributes": {
      "usage_fee": "Balance",
      "version": "MetaVersion"
    },
    "Tax": "Permill",
    "TargetIdentities": {
      "identities": "Vec<IdentitityId>",
      "treatment": "TargetTreatment"
    },
    "TargetTreatment": {
      "_enum": [
        "Include",
        "Exclude"
      ]
    },
    "CAKind": {
      "_enum": [
        "PredictableBenefit",
        "UnpredictableBenfit",
        "IssuerNotice",
        "Reorganization",
        "Other"
      ]
    },
    "CADetails": "Text",
    "CACheckpoint": {
      "_enum": {
        "Scheduled": "ScheduleId",
        "Existing": "CheckpointId"
      }
    },
    "RecordDate": {
      "date": "Moment",
      "checkpoint": "CACheckpoint"
    },
    "RecordDateSpec": {
      "_enum": {
        "Scheduled": "Moment",
        "Existing": "CheckpointId"
      }
    },
    "CorporateAction": {
      "kind": "CAKind",
      "record_date": "Option<RecordDate>",
      "details": "Text",
      "targets": "TargetIdentities",
      "default_withholding_tax": "Tax",
      "withholding_tax": "Vec<(IdentityId, Tax)>"
    },
    "LocalCAId": "u32",
    "CAId": {
      "ticker": "Ticker",
      "local_id": "LocalCAId"
    },
    "Distribution": {
      "from": "PortfolioId",
      "currency": "Ticker",
      "amount": "Balance",
      "remaining": "Balance",
      "reclaimed": "bool",
      "payment_at": "Moment",
      "expires_at": "Option<Moment>"
    },
    "SlashingSwitch": {
      "_enum": [
        "Validator",
        "ValidatorAndNominator",
        "None"
      ]
    },
    "PriceTier": {
      "total": "Balance",
      "price": "Balance"
    }
  },
  "rpc": {
    "compliance": {
      "canTransfer": {
        "description": "Checks whether a transaction with given parameters is compliant to the compliance manager conditions",
        "params": [
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "from_did",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "to_did",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "AssetComplianceResult"
      }
    },
    "identity": {
      "isIdentityHasValidCdd": {
        "description": "use to tell whether the given did has valid cdd claim or not",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "buffer_time",
            "type": "u64",
            "isOptional": true
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CddStatus"
      },
      "getAssetDid": {
        "description": "function is used to query the given ticker DID",
        "params": [
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "AssetDidResult"
      },
      "getDidRecords": {
        "description": "Used to get the did record values for a given DID",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "DidRecords"
      },
      "getDidStatus": {
        "description": "Retrieve status of the DID",
        "params": [
          {
            "name": "did",
            "type": "Vec<IdentityId>",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<DidStatus>"
      },
      "getFilteredAuthorizations": {
        "description": "Retrieve authorizations data for a given signatory and filtered using the given authorization type",
        "params": [
          {
            "name": "signatory",
            "type": "Signatory",
            "isOptional": false
          },
          {
            "name": "allow_expired",
            "type": "bool",
            "isOptional": false
          },
          {
            "name": "auth_type",
            "type": "AuthorizationType",
            "isOptional": true
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<Authorization>"
      },
      "getKeyIdentityData": {
        "description": "Query relation between a signing key and a DID",
        "params": [
          {
            "name": "acc",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Option<KeyIdentityData<IdentityId>>"
      }
    },
    "pips": {
      "getVotes": {
        "description": "Summary of votes of a proposal given by index",
        "params": [
          {
            "name": "index",
            "type": "u32",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "VoteCount"
      },
      "proposedBy": {
        "description": "Retrieves proposal indices started by address",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<u32>"
      },
      "votedOn": {
        "description": "Retrieves proposal address indices voted on",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<u32>"
      },
      "votingHistoryByAddress": {
        "description": "Retrieves proposal `address` indices voted on",
        "params": [
          {
            "name": "address",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "HistoricalVoting"
      },
      "votingHistoryById": {
        "description": "Retrieve historical voting of `id` identity",
        "params": [
          {
            "name": "id",
            "type": "IdentityId",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "HistoricalVotingByAddress"
      }
    },
    "protocolFee": {
      "computeFee": {
        "description": "Gets the fee of a chargeable extrinsic operation",
        "params": [
          {
            "name": "op",
            "type": "ProtocolOp",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CappedFee"
      }
    },
    "staking": {
      "getCurve": {
        "description": "Retrieves curves parameters",
        "params": [
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "Vec<(Perbill, Perbill)>"
      }
    },
    "asset": {
      "canTransfer": {
        "description": "Checks whether a transaction with given parameters can take place or not",
        "params": [
          {
            "name": "sender",
            "type": "AccountId",
            "isOptional": false
          },
          {
            "name": "from_custodian",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "from_portfolio",
            "type": "PortfolioId",
            "isOptional": false
          },
          {
            "name": "to_custodian",
            "type": "Option<IdentityId>",
            "isOptional": false
          },
          {
            "name": "to_portfolio",
            "type": "PortfolioId",
            "isOptional": false
          },
          {
            "name": "ticker",
            "type": "Ticker",
            "isOptional": false
          },
          {
            "name": "value",
            "type": "Balance",
            "isOptional": false
          },
          {
            "name": "blockHash",
            "type": "Hash",
            "isOptional": true
          }
        ],
        "type": "CanTransferResult"
      }
    },
    "portfolio": {
      "getPortfolios": {
        "description": "Gets all user-defined portfolio names of an identity",
        "params": [
          {
            "name": "did",
            "type": "IdentityId",
            "isOptional": false
          }
        ],
        "type": "GetPortfoliosResult"
      },
      "getPortfolioAssets": {
        "description": "Gets the balances of all assets in a given portfolio",
        "params": [
          {
            "name": "portfolio_id",
            "type": "PortfolioId",
            "isOptional": false
          }
        ],
        "type": "GetPortfolioAssetsResult"
      }
    }
  }
};

const pmf = alcyone;

const schema: Record<NetworkName, { rpc: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>,
  types: RegistryTypes }> = {
  pme,
  pmf,
  alcyone
};

export default schema;
