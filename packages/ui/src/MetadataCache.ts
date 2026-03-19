import type { MetadataDef } from '@polkadot/extension-inject/types';

const metadataGets = new Map<string, Promise<MetadataDef | null>>();

export function getSavedMeta (genesisHash: string): Promise<MetadataDef | null> | undefined {
  return metadataGets.get(genesisHash);
}

export function setSavedMeta (genesisHash: string, def: Promise<MetadataDef | null>): void {
  metadataGets.set(genesisHash, def);
}

export function clearSavedMeta (genesisHash: string): void {
  metadataGets.delete(genesisHash);
}
