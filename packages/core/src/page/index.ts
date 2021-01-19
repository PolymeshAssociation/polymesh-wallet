import { sendMessage } from '@polkadot/extension-base/page';

import PolymeshInjected from './injected';

export async function enable (origin: string): Promise<PolymeshInjected> {
  await sendMessage('pub(authorize.tab)', { origin });

  return new PolymeshInjected(sendMessage);
}
