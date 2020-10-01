import { PolyMessageTypesWithNoSubscriptions, PolyMessageTypesWithNullRequest, PolyMessageTypesWithSubscriptions, PolyRequestTypes, PolyResponseTypes, PolySubscriptionMessageTypes } from '../background/types';

export interface SendRequest {
  <TMessageType extends PolyMessageTypesWithNullRequest>(message: TMessageType): Promise<PolyResponseTypes[TMessageType]>;
  <TMessageType extends PolyMessageTypesWithNoSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType]): Promise<PolyResponseTypes[TMessageType]>;
  <TMessageType extends PolyMessageTypesWithSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType], subscriber: (data: PolySubscriptionMessageTypes[TMessageType]) => void): Promise<PolyResponseTypes[TMessageType]>;
}
