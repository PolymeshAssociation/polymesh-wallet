import BaseStore from '@polkadot/extension-base/stores/Base';

export class AuxStore extends BaseStore<string> {
  constructor () {
    super('did');
  }

  public all (cb: (key: string, value: string) => void): void {
    super.all(cb);
  }

  public get (key: string, update: (value: string) => void): void {
    super.get(key, update);
  }

  public remove (key: string, update?: () => void): void {
    super.remove(key, update);
  }

  public set (key: string, value: string, update?: () => void): void {
    super.set(key, value, update);
  }
}

export default new AuxStore();
