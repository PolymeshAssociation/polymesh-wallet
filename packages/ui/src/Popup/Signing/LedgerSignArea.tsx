/* eslint-disable deprecation/deprecation */

import type { Chain } from '@polkadot/extension-chains/types';
import type { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import { Metadata } from '@polkadot/types';
import { assert, hexToU8a, objectSpread, u8aToHex } from '@polkadot/util';
import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { POLYMESH_GENERIC_SPEC_VERSION } from '@polymeshassociation/extension-core/constants';
import { ActionContext, Warning } from '@polymeshassociation/extension-ui/components';
import { useIsPopup, useLedger, useMetadata } from '@polymeshassociation/extension-ui/hooks';
import { cancelSignRequest, windowOpen } from '@polymeshassociation/extension-ui/messaging';
import { Button, Flex } from '@polymeshassociation/extension-ui/ui';
import polymeshSignedExtensions from '@polymeshassociation/polymesh-types/signedExtensions';

import { formatLedgerError, getStoredLedgerApp, Status } from '../../hooks/useLedger';

interface Props {
  accountIndex?: number;
  addressOffset?: number;
  className?: string;
  error: string | null;
  genesisHash?: `0x${string}`;
  onSignature?: ({ signature }: { signature: `0x${string}` }, signedTransaction?: HexString) => void;
  payloadExt?: ExtrinsicPayload;
  payloadJson?: SignerPayloadJSON;
  setError: (value: string | null) => void;
  signId: string;
}

function getMetadataProof (chain: Chain, payload: SignerPayloadJSON) {
  const m = chain.definition.rawMetadata;

  assert(m, 'Metadata for this chain is required to sign with the Polymesh or Polkadot Ledger apps.');

  const merkleizedMetadata = merkleizeMetadata(m, {
    base58Prefix: chain.ss58Format,
    decimals: chain.tokenDecimals,
    // specName: chain.name.toLowerCase(), This does not match the specName in the metadata for some chains (e.g. Polymesh), but it is not actually used in the signing process, so we can omit it here.
    specVersion: chain.specVersion,
    tokenSymbol: chain.tokenSymbol
  });
  const metadataHash = u8aToHex(merkleizedMetadata.digest());
  const newPayload = objectSpread<SignerPayloadJSON>({}, payload, { metadataHash, mode: 1 });
  const raw = chain.registry.createType('ExtrinsicPayload', newPayload);

  return {
    raw,
    txMetadata: merkleizedMetadata.getProofForExtrinsicPayload(u8aToHex(raw.toU8a(true)))
  };
}

function LedgerSignArea ({ accountIndex,
  addressOffset,
  error,
  genesisHash,
  onSignature,
  payloadExt,
  payloadJson,
  setError,
  signId }: Props): React.ReactElement<Props> {
  const [isBusy, setIsBusy] = useState(false);
  const chain = useMetadata(genesisHash);
  // Read specVersion directly from the payload (always available) so the correct app is
  // selected immediately without waiting for useMetadata to resolve asynchronously.
  const payloadSpecVersion = payloadJson ? parseInt(payloadJson.specVersion, 16) : undefined;
  const specVersion = payloadSpecVersion ?? chain?.specVersion;
  const { error: ledgerError,
    isLoading: ledgerLoading,
    ledger,
    refresh,
    // TODO: Pass isEthereum and add an Ethereum signing path in _onSignLedger once
    //       Ethereum/EVM Ledger account support is implemented.
    status: ledgerStatus } = useLedger(genesisHash, accountIndex, addressOffset, false, specVersion);
  const onAction = useContext(ActionContext);
  const isPopup = useIsPopup();
  // Use the effective app — legacy is auto-selected for chains below the spec version threshold.
  // TODO: Remove the 'legacy' fallback once all supported chains have been upgraded
  //       to spec version >= POLYMESH_GENERIC_SPEC_VERSION.
  const effectiveLedgerApp = (specVersion !== undefined && specVersion < POLYMESH_GENERIC_SPEC_VERSION)
    ? 'legacy'
    : getStoredLedgerApp() ?? 'polymesh';

  const _onRefresh = useCallback(async () => {
    if (isPopup && ledgerStatus === Status.Device) {
      await windowOpen('/').catch(console.error);
      window.close();
    } else {
      refresh();
      setError(null);
    }
  }, [isPopup, ledgerStatus, refresh, setError]);

  const _onSignLedger = useCallback((): void => {
    if (!ledger || !onSignature) {
      return;
    }

    setError(null);
    setIsBusy(true);

    const currApp = effectiveLedgerApp;

    if (currApp === 'generic' || currApp === 'polymesh') {
      if (!payloadJson || !chain || !payloadExt) {
        if (!chain) {
          setError('Chain information not found. Ensure the wallet is connected to the correct network and try again.');
        }

        setIsBusy(false);

        return;
      }

      if (!chain.definition.rawMetadata) {
        setError('Metadata for this chain is not yet available. Ensure the wallet is connected to the correct network and try again.');
        setIsBusy(false);

        return;
      }

      // Chains below spec version 8_000_000 do not support metadata hash signing.
      if (chain.specVersion < POLYMESH_GENERIC_SPEC_VERSION) {
        setError(`Chain spec version ${chain.specVersion} is below the minimum required (${POLYMESH_GENERIC_SPEC_VERSION}) for Generic Ledger app signing. Please switch to the Legacy app in Ledger Settings.`);
        setIsBusy(false);

        return;
      }

      // Load full metadata into the registry so it can encode/decode call data.
      // metadataExpand (extension-chains) only uses metaCalls (base64 legacy format),
      // but we store rawMetadata (hex). Without this, createType('Extrinsic') fails
      // because the registry has no call index mappings.
      chain.registry.setMetadata(
        new Metadata(chain.registry, hexToU8a(chain.definition.rawMetadata)),
        payloadJson.signedExtensions,
        polymeshSignedExtensions
      );

      let raw: ReturnType<typeof getMetadataProof>['raw'];
      let metaBuff: Buffer;

      try {
        const proof = getMetadataProof(chain, payloadJson);

        raw = proof.raw;
        metaBuff = Buffer.from(proof.txMetadata);
      } catch (e) {
        setError(formatLedgerError((e as Error).message));
        setIsBusy(false);

        return;
      }

      (ledger as LedgerGeneric).signWithMetadata(raw.toU8a(true), accountIndex, addressOffset, { metadata: metaBuff })
        .then((signature) => {
          const extrinsic = chain.registry.createType(
            'Extrinsic',
            { method: raw.method },
            { version: 4 }
          );

          (ledger as LedgerGeneric).getAddress(chain.ss58Format, false, accountIndex, addressOffset)
            .then(({ address }) => {
              extrinsic.addSignature(address, signature.signature, raw.toHex());
              onSignature(signature, extrinsic.toHex());
            })
            .catch((e: Error) => {
              setError(formatLedgerError(e.message));
              setIsBusy(false);
            });
        })
        .catch((e: Error) => {
          setError(formatLedgerError(e.message));
          setIsBusy(false);
        });
    } else {
      // TODO: Remove this legacy signing branch once all supported chains have been
      //       upgraded to spec version >= POLYMESH_GENERIC_SPEC_VERSION.
      // legacy (old Polymesh chainSpecific Ledger app)
      if (!payloadExt) {
        setIsBusy(false);

        return;
      }

      (ledger as Ledger)
        .sign(payloadExt.toU8a(true), accountIndex, addressOffset)
        .then((signature) => {
          onSignature(signature);
        })
        .catch((e: Error) => {
          setError(formatLedgerError(e.message));
          setIsBusy(false);
        });
    }
  }, [accountIndex, addressOffset, chain, effectiveLedgerApp, ledger, onSignature, payloadExt, payloadJson, setError]);

  const _onCancel = useCallback(() => {
    (async () => {
      await cancelSignRequest(signId);
      onAction();
    })().catch(console.error);
  }, [onAction, signId]);

  const warning = useMemo(() => {
    if (ledgerStatus === Status.Device) {
      return isPopup
        ? 'Please ensure your Ledger device is plugged in and unlocked. Then go full screen and click the connect button to connect your device.'
        : 'Please ensure your Ledger device is plugged in and unlocked. Then click the connect button.';
    }

    return ledgerError;
  }, [ledgerStatus, ledgerError, isPopup]);

  const buttonLabel = useMemo(() => {
    if (warning) {
      if (isPopup && ledgerStatus === Status.Device) {
        return 'Open Full Screen';
      }

      if (ledgerStatus === Status.Device) {
        return 'Connect';
      }

      return 'Refresh';
    }

    return 'Sign on Ledger';
  }, [isPopup, ledgerStatus, warning]);

  return (
    <Flex
      flexDirection='column'
      p='s'
    >
      {error && <Warning isDanger>{error}</Warning>}
      {warning && <Warning>{warning}</Warning>}
      <Flex
        alignItems='stretch'
        flexDirection='row'
        mt='s'
        width='100%'
      >
        <Flex flex={1}>
          <Button
            fluid
            onClick={_onCancel}
            variant='secondary'
          >
            Cancel
          </Button>
        </Flex>
        <Flex
          flex={1}
          ml='xs'
        >
          <Button
            busy={isBusy || ledgerLoading}
            fluid
            onClick={warning ? _onRefresh : _onSignLedger}
            type={warning ? 'submit' : undefined}
          >
            {buttonLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LedgerSignArea;
