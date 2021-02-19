import { polySchemaUrl } from '@polymathnetwork/extension-core/constants';
import { NetworkName, Schema } from '@polymathnetwork/extension-core/types';

import fallback from './fallback';

const loadedSchemas: Record<NetworkName, Schema> = {};

// @TODO handle 404

const request = async (n: NetworkName): Promise<undefined | Schema> => {
  return fetch(`${polySchemaUrl}${n}`).then((response: Response) => {
    // if (response.type === '200') {
    // @ts-ignore
    const data: Schema = response.json();

    return data;
    // } else {
    //   return Promise.resolve(undefined);
    // }
  });
};

const load = async (): Promise<void> => {
  const networks = Object.keys(NetworkName);
  const promises = networks.map((n) => request(n as NetworkName));

  try {
    const responses = await Promise.all(promises);

    for (let i = 0; i < Object.keys(NetworkName).length; i++) {
      const network = networks[i];

      if (responses[i]) {
        loadedSchemas[network as NetworkName] = responses[i] as unknown as Schema;
      }
    }

    console.log('/////////////////////////////////////////////////////////// responses', responses);
  } catch (error) {
    console.error(`Failed to load schemas from ${polySchemaUrl}`, error);
  }
};

const get = (n: NetworkName): Schema => {
  if (loadedSchemas[n]) {
    console.log('Returning loaded schema of:', n);

    return loadedSchemas[n];
  }

  console.log('Returning stored schema of:', n);

  return fallback[n];
};

export default {
  load,
  get
};
