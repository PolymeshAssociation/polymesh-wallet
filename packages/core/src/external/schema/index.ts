import {
  dynamicSchemaEnabled,
  polySchemaUrl,
} from '@polymeshassociation/extension-core/constants';
import { NetworkName, Schema } from '@polymeshassociation/extension-core/types';

import fallback from './fallback';

let loadedSchemas: Record<NetworkName, undefined | Schema>;

const request = async (n: NetworkName): Promise<undefined | Schema> => {
  return fetch(`${polySchemaUrl}${n}`)
    .then((response: Response) => {
      if (response.ok) {
        const data = response.json() as unknown as Promise<Schema>;

        return data;
      }

      return undefined;
    })
    .then((value: Schema | undefined) => {
      // Do some pseudo-validation to make sure we're no being fed garbage data.
      if (value && !!value.rpc && !!value.types) {
        return value;
      }

      return undefined;
    })
    .catch((error) => {
      console.error(`Failed to fetch "${n}" schema.`, error);

      return Promise.resolve(undefined);
    });
};

const load = async (): Promise<void> => {
  const networks = Object.keys(NetworkName).filter(
    (n) => dynamicSchemaEnabled[n as NetworkName]
  );
  const promises = networks.map((n) => request(n as NetworkName));

  try {
    const responses = await Promise.all(promises);

    // Don't override loadedSchemas if all requests failed.
    if (
      responses.filter((res) => res === undefined).length === responses.length
    ) {
      return;
    }

    loadedSchemas = responses.reduce((schemas, schema, i) => {
      schemas[networks[i] as NetworkName] = schema;

      return schemas;
    }, {} as Record<NetworkName, Schema | undefined>);
  } catch (error) {
    console.error(`Failed to load schemas from ${polySchemaUrl}`, error);
  }
};

const get = (n: NetworkName): Schema => {
  // @ts-ignore
  return loadedSchemas && !!loadedSchemas[n] ? loadedSchemas[n] : fallback[n];
};

export default {
  load,
  get,
};
