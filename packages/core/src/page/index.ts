import {
  PolyMessageTypes,
  PolyMessageTypesWithNoSubscriptions,
  PolyMessageTypesWithNullRequest,
  PolyMessageTypesWithSubscriptions,
  PolyRequestTypes,
  PolyResponseTypes,
  PolySubscriptionMessageTypes,
  PolyTransportRequestMessage,
  PolyTransportResponseMessage,
} from '../background/types';
import { ORIGINS } from '../constants';
import PolymeshInjected from './injected';

export interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data?: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

export type Handlers = Record<string, Handler>;

const handlers: Handlers = {};
let idCounter = 0;

// a generic message sender that creates an event, returning a promise that will
// resolve once the event is resolved (by the response listener just below this)
export function sendMessage<
  TMessageType extends PolyMessageTypesWithNullRequest
>(message: TMessageType): Promise<PolyResponseTypes[TMessageType]>;
export function sendMessage<
  TMessageType extends PolyMessageTypesWithNoSubscriptions
>(
  message: TMessageType,
  request: PolyRequestTypes[TMessageType]
): Promise<PolyResponseTypes[TMessageType]>;
export function sendMessage<
  TMessageType extends PolyMessageTypesWithSubscriptions
>(
  message: TMessageType,
  request: PolyRequestTypes[TMessageType],
  subscriber: (data: PolySubscriptionMessageTypes[TMessageType]) => void
): Promise<PolyResponseTypes[TMessageType]>;

export function sendMessage<TMessageType extends PolyMessageTypes>(
  message: TMessageType,
  request?: PolyRequestTypes[TMessageType],
  subscriber?: (data: unknown) => void
): Promise<PolyResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { reject, resolve, subscriber };

    const transportRequestMessage: PolyTransportRequestMessage<TMessageType> = {
      id,
      message,
      origin: ORIGINS.PAGE,
      request: request || (null as PolyRequestTypes[TMessageType]),
    };

    window.postMessage(transportRequestMessage, '*');
  });
}

export async function enable(origin: string): Promise<PolymeshInjected> {
  await sendMessage('pub(authorize.tab)', { origin });

  return new PolymeshInjected(sendMessage);
}

export function handleResponse<TMessageType extends PolyMessageTypes>(
  data: PolyTransportResponseMessage<TMessageType> & { subscription?: string }
): void {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);

    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
}
