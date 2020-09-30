import Injected from '@polkadot/extension-base/page/Injected';
import { SendRequest } from '@polkadot/extension-base/page/types';
import Network from './Network';

class PolymeshInjected extends Injected {
  public readonly network: Network;

  constructor (sendRequest: SendRequest) {
    super(sendRequest);
    this.network = new Network(sendRequest);
  }
}

export default PolymeshInjected;
