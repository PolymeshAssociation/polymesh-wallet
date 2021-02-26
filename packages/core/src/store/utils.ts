import { NetworkName } from '../types';

export function initialFeatureState (): Record<NetworkName, unknown> {
  const state = Object.keys(NetworkName).reduce(function (acc, key) {
    acc[key as NetworkName] = {};

    return acc;
  }, {} as Record<NetworkName, unknown>);

  return state;
}

// "Content-Type: application/json" -d '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}'

export function wssFetch (url: string, method: string, params: any[]) {
  return new Promise((resolve) => {
    console.time('wssFetch');
    const requestData = {
      id: '1',
      jsonrpc: '2.0',
      method,
      params
    };

    const body = JSON.stringify(requestData);

    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.timeEnd('wssFetch');

      resolve(data.result);

      socket.close();
    };

    socket.onopen = () => {
      socket.send(body);
    };
  });
}
