import { SendRequest } from '@polymathnetwork/extension-core/page/types';

import { InjectedProofs, ProofRequestPayload, ProofResult } from '../types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;
let nextId = 0;

export default class Proofs implements InjectedProofs {
  constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public async generateProof (payload: ProofRequestPayload): Promise<ProofResult> {
    const id = ++nextId;
    const result = await sendRequest('poly:pub(proofs.generateProof)', payload);

    return {
      ...result,
      id
    };
  }
}
