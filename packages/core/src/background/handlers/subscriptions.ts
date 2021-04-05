import { PolyMessageTypesWithSubscriptions, PolySubscriptionMessageTypes } from '../types';

type Subscriptions = Record<string, chrome.runtime.Port>;

const subscriptions: Subscriptions = {};

// return a subscription callback, that will send the data to the caller via the port
export function createSubscription<TMessageType extends PolyMessageTypesWithSubscriptions> (id: string, port: chrome.runtime.Port): (data: PolySubscriptionMessageTypes[TMessageType]) => void {
  subscriptions[id] = port;

  return (subscription: unknown): void => {
    if (subscriptions[id]) {
      port.postMessage({ id, subscription });
    }
  };
}

// clear a previous subscriber
export function unsubscribe (id: string): void {
  if (subscriptions[id]) {
    delete subscriptions[id];
  } else {
    console.error(`Unable to unsubscribe from ${id}`);
  }
}
