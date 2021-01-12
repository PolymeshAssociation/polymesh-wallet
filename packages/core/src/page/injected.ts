import Injected from '@polkadot/extension-base/page/Injected';
import { SendRequest } from '@polymathnetwork/extension-core/page/types';

import Network from './Network';
import Proofs from './Proofs';

class PolymeshInjected extends Injected {
  public readonly network: Network;
  public readonly proofs: Proofs;

  constructor (sendRequest: SendRequest) {
    super(sendRequest);
    this.network = new Network(sendRequest);
    this.proofs = new Proofs(sendRequest);
  }
}

export default PolymeshInjected;
