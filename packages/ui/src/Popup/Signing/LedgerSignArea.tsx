/* eslint-disable deprecation/deprecation */

import type { Chain } from '@polkadot/extension-chains/types';
import type { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import { assert, hexToNumber, objectSpread, stringShorten, u8aEq, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { POLYMESH_GENERIC_SPEC_VERSION } from '@polymeshassociation/extension-core/constants';
import { ActionContext, Warning } from '@polymeshassociation/extension-ui/components';
import { useIsPopup, useLedger, useMetadata } from '@polymeshassociation/extension-ui/hooks';
import { cancelSignRequest, windowOpen } from '@polymeshassociation/extension-ui/messaging';
import { Button, Flex } from '@polymeshassociation/extension-ui/ui';

import { formatLedgerError, Status } from '../../hooks/useLedger';

interface Props {
  accountIndex?: number;
  addressOffset?: number;
  className?: string;
  error: string | null;
  footerExtra?: React.ReactNode;
  genesisHash?: `0x${string}`;
  onSignature?: ({ signature }: { signature: `0x${string}` }, signedTransaction?: HexString) => void;
  payloadExt?: ExtrinsicPayload;
  payloadJson?: SignerPayloadJSON;
  setError: (value: string | null) => void;
  signId: string;
  warningMessage?: string;
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
  footerExtra,
  genesisHash,
  onSignature,
  payloadExt,
  payloadJson,
  setError,
  signId,
  warningMessage }: Props): React.ReactElement<Props> {
  const [isBusy, setIsBusy] = useState(false);
  const [isRemoteBusy, setIsRemoteBusy] = useState(false);
  const isLocalSigningRef = useRef(false);

  // Sync signing-busy state across windows via BroadcastChannel.
  const signingChannel = useMemo(() => new BroadcastChannel('poly:ledger-signing'), []);

  useEffect(() => {
    const onMessage = (e: MessageEvent): void => {
      if (e.data === 'signing-start') {
        setIsRemoteBusy(true);
      } else if (e.data === 'signing-end') {
        setIsRemoteBusy(false);
      }
    };

    signingChannel.addEventListener('message', onMessage);

    return () => {
      // Only broadcast signing-end if this window initiated signing,
      // so closing a non-signing window doesn't unblock other windows.
      if (isLocalSigningRef.current) {
        signingChannel.postMessage('signing-end');
      }

      signingChannel.removeEventListener('message', onMessage);
      signingChannel.close();
    };
  }, [signingChannel]);

  const endSigning = useCallback(() => {
    setIsBusy(false);
    isLocalSigningRef.current = false;
    signingChannel.postMessage('signing-end');
  }, [signingChannel]);

  const { chain } = useMetadata(genesisHash);
  // Read specVersion directly from the payload (always available) so the correct app is
  // selected immediately without waiting for useMetadata to resolve asynchronously.
  // hexToNumber returns NaN for invalid input; fall back to chain?.specVersion in that case.
  const payloadSpecVersion = payloadJson ? hexToNumber(payloadJson.specVersion) : undefined;
  const specVersion = (payloadSpecVersion !== undefined && !Number.isNaN(payloadSpecVersion))
    ? payloadSpecVersion
    : chain?.specVersion;
  const { address: ledgerAddress,
    error: ledgerError,
    isLoading: ledgerLoading,
    ledger,
    ledgerApp,
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
    : ledgerApp;

  const _onRefresh = useCallback(async () => {
    if (isPopup && ledgerStatus === Status.Device) {
      await windowOpen('/').catch(console.error);
      window.close();
    } else {
      setError(null);
      refresh();
    }
  }, [isPopup, ledgerStatus, refresh, setError]);

  const _onSignLedger = useCallback((): void => {
    if (!ledger || !onSignature) {
      return;
    }

    setError(null);
    setIsBusy(true);
    isLocalSigningRef.current = true;
    signingChannel.postMessage('signing-start');

    const currApp = effectiveLedgerApp;

    if (currApp === 'generic' || currApp === 'polymesh') {
      if (!payloadJson || !chain || !payloadExt) {
        if (!chain) {
          setError('Chain metadata not found. Ensure the wallet is connected to the correct network and try again.');
        }

        endSigning();

        return;
      }

      if (!chain.definition.rawMetadata) {
        setError('Metadata for this chain is not yet available. Ensure the wallet is connected to the correct network and try again.');
        endSigning();

        return;
      }

      // Chains below spec version 8_000_000 do not support metadata hash signing.
      if (chain.specVersion < POLYMESH_GENERIC_SPEC_VERSION) {
        setError(`Chain spec version ${chain.specVersion} is below the minimum required (${POLYMESH_GENERIC_SPEC_VERSION}) for Generic Ledger app signing. Please switch to the Legacy app in Ledger Settings.`);
        endSigning();

        return;
      }

      let raw: ReturnType<typeof getMetadataProof>['raw'];
      let metaBuff: Buffer;

      try {
        const proof = getMetadataProof(chain, payloadJson);

        raw = proof.raw;
        metaBuff = Buffer.from(proof.txMetadata);
      } catch (e) {
        setError(formatLedgerError((e as Error).message));
        endSigning();

        return;
      }

      (ledger as LedgerGeneric).signWithMetadata(raw.toU8a(true), accountIndex, addressOffset, { metadata: metaBuff })
        .then((signature) => {
          const extrinsic = chain.registry.createType(
            'Extrinsic',
            { method: raw.method },
            { version: 4 }
          );

          assert(ledgerAddress, 'Ledger address is not available. Please reconnect your device.');
          // Re-encode using the ss58Format from the authoritative chain metadata to be safe.
          const address = encodeAddress(decodeAddress(ledgerAddress), chain.ss58Format);

          extrinsic.addSignature(address, signature.signature, raw.toHex());
          onSignature(signature, extrinsic.toHex());
        })
        .catch((e: Error) => {
          setError(formatLedgerError(e.message));
          endSigning();
        });
    } else {
      // TODO: Remove this legacy signing branch once all supported chains have been
      //       upgraded to spec version >= POLYMESH_GENERIC_SPEC_VERSION.
      // legacy (old Polymesh chainSpecific Ledger app)
      if (!payloadExt) {
        endSigning();

        return;
      }

      (ledger as Ledger)
        .sign(payloadExt.toU8a(true), accountIndex, addressOffset)
        .then((signature) => {
          onSignature(signature);
        })
        .catch((e: Error) => {
          setError(formatLedgerError(e.message));
          endSigning();
        });
    }
  }, [accountIndex, addressOffset, chain, effectiveLedgerApp, endSigning, ledger, ledgerAddress, onSignature, payloadExt, payloadJson, setError, signingChannel]);

  const _onCancel = useCallback(() => {
    (async () => {
      await cancelSignRequest(signId);
      onAction();
    })().catch(console.error);
  }, [onAction, signId]);

  // Compare raw public keys so SS58 prefix differences don't cause false positives.
  // A mismatch means the wrong ledger device is connected or wrong Ledger app mode
  // or account derivation is active.
  const mismatchWarning = useMemo(() => {
    if (!ledgerAddress || !payloadJson?.address) {
      return null;
    }

    try {
      return !u8aEq(decodeAddress(ledgerAddress), decodeAddress(payloadJson.address))
        ? `Address mismatch: derived ${stringShorten(ledgerAddress, 8)}, expected ${stringShorten(payloadJson.address, 8)}. Check that the correct Ledger device is connected and the correct app is selected in Settings.`
        : null;
    } catch {
      return null;
    }
  }, [ledgerAddress, payloadJson?.address]);

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
    >
      {footerExtra}
      {!!warningMessage && <Warning isDanger>{warningMessage}</Warning>}
      {error && <Warning isDanger>{error}</Warning>}
      {mismatchWarning && <Warning isDanger>{mismatchWarning}</Warning>}
      {warning && <Warning>{warning}</Warning>}
      <Flex
        alignItems='stretch'
        flexDirection='row'
        p='s'
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
            busy={isBusy || ledgerLoading || isRemoteBusy}
            disabled={!!mismatchWarning || isRemoteBusy}
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
