import { SendRequest } from '@polymathnetwork/extension-core/page/types';

import { InjectedUid, ProofRequestPayload, ProofResult } from '../types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;
let nextId = 0;

export default class Uid implements InjectedUid {
  constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public async requestProof (payload: ProofRequestPayload): Promise<ProofResult> {
    const id = ++nextId;
    const result = await sendRequest('poly:pub(uid.requestProof)', payload);

    return {
      ...result,
      id
    };
  }
}
