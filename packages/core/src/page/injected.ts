import type { Injected } from '@polkadot/extension-inject/types';
import type { SendRequest } from '@polymeshassociation/extension-core/page/types';

import Accounts from '@polkadot/extension-base/page/Accounts';
import Metadata from '@polkadot/extension-base/page/Metadata';
import PostMessageProvider from '@polkadot/extension-base/page/PostMessageProvider';
import Signer from '@polkadot/extension-base/page/Signer';

import Network from './Network';

export default class PolymeshInjected implements Injected {
  public readonly accounts: Accounts;
  public readonly metadata: Metadata;
  public readonly network: Network;
  public readonly provider: PostMessageProvider;
  public readonly signer: Signer;

  constructor (sendRequest: SendRequest) {
    this.accounts = new Accounts(sendRequest);
    this.metadata = new Metadata(sendRequest);
    this.network = new Network(sendRequest);
    this.provider = new PostMessageProvider(sendRequest);
    this.signer = new Signer(sendRequest);
  }
}
