import Injected from '@polkadot/extension-base/page/Injected';
import { SendRequest } from '@polymeshassociation/extension-core/page/types';

import Network from './Network';
import Uid from './Uid';

class PolymeshInjected extends Injected {
  public readonly network: Network;
  public readonly uid: Uid;

  constructor(sendRequest: SendRequest) {
    super(sendRequest);
    this.network = new Network(sendRequest);
    this.uid = new Uid(sendRequest);
  }
}

export default PolymeshInjected;
