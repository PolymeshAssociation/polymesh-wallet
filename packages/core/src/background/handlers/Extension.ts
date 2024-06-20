import DotExtension from '@polkadot/extension-base/background/handlers/Extension';
import DotState from '@polkadot/extension-base/background/handlers/State';
import {
  ResponseType,
  MessageTypes,
  RequestRpcUnsubscribe,
} from '@polkadot/extension-base/background/types';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { callDetails } from '@polymeshassociation/extension-core/external';
import { getNetworkUrl } from '@polymeshassociation/extension-core/store/getters';
import {
  renameIdentity,
  setNetwork,
  setCustomNetworkUrl,
  setSelectedAccount,
  toggleIsDeveloper,
} from '@polymeshassociation/extension-core/store/setters';
import {
  subscribeIdentifiedAccounts,
  subscribeNetworkState,
  subscribeSelectedAccount,
  subscribeSelectedNetwork,
  subscribeStatus,
} from '@polymeshassociation/extension-core/store/subscribers';
import { recodeAddress } from '@polymeshassociation/extension-core/utils';

import {
  ALLOWED_PATH,
  AllowedPath,
  PolyMessageTypes,
  PolyRequestTypes,
  PolyResponseType,
  RequestPolyCallDetails,
  RequestPolyGlobalChangePass,
  RequestPolyIdentityRename,
  RequestPolyNetworkSet,
  RequestPolyCustomNetworkUrlSet,
  RequestPolySelectedAccountSet,
  RequestPolyValidatePassword,
  ResponsePolyCallDetails,
} from '../types';
import { createSubscription, unsubscribe } from './subscriptions';

/**
 * Extension handles messages coming from the extension popup UI (i.e packages/ui)
 */
export default class Extension extends DotExtension {
  constructor(state: DotState) {
    super(state);
  }

  private polyAccountsSubscribe(
    id: string,
    port: chrome.runtime.Port
  ): boolean {
    const cb = createSubscription<'poly:pri(accounts.subscribe)'>(id, port);

    const reduxUnsub = subscribeIdentifiedAccounts(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyNetworkSubscribe(id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(network.subscribe)'>(id, port);

    const reduxUnsub = subscribeSelectedNetwork(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private subscribeNetworkState(
    id: string,
    port: chrome.runtime.Port
  ): boolean {
    const cb = createSubscription<'poly:pri(networkState.subscribe)'>(id, port);

    const reduxUnsub = subscribeNetworkState(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polySelectedAccountSubscribe(
    id: string,
    port: chrome.runtime.Port
  ): boolean {
    const cb = createSubscription<'poly:pri(selectedAccount.subscribe)'>(
      id,
      port
    );

    const reduxUnsub = subscribeSelectedAccount(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyStoreStatusSubscribe(
    id: string,
    port: chrome.runtime.Port
  ): boolean {
    const cb = createSubscription<'poly:pri(status.subscribe)'>(id, port);

    const reduxUnsub = subscribeStatus(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyNetworkSet({ network }: RequestPolyNetworkSet): boolean {
    setNetwork(network);

    return true;
  }

  private polyCustomNetworkUrlSet({ customNetworkUrl }: RequestPolyCustomNetworkUrlSet): boolean {
    setCustomNetworkUrl(customNetworkUrl);

    return true;
  }

  private polyIdentityRename({
    did,
    name,
  }: RequestPolyIdentityRename): boolean {
    renameIdentity(did, name);

    return true;
  }

  private polySelectedAccount({
    account,
  }: RequestPolySelectedAccountSet): boolean {
    setSelectedAccount(account);

    return true;
  }

  private polyCallDetailsGet({
    request,
  }: RequestPolyCallDetails): Promise<ResponsePolyCallDetails> {
    const networkUrl = getNetworkUrl();

    return callDetails(request, networkUrl);
  }

  private polyIsDevToggle(): boolean {
    toggleIsDeveloper();

    return true;
  }

  private _changePassword(
    pair: KeyringPair,
    oldPass: string,
    newPass: string
  ): boolean {
    try {
      if (!pair.isLocked) {
        pair.lock();
      }

      pair.decodePkcs8(oldPass);
    } catch (error) {
      return false;
    }

    keyring.encryptAccount(pair, newPass);

    return true;
  }

  private async globalChangePassword({
    newPass,
    oldPass,
  }: RequestPolyGlobalChangePass): Promise<boolean> {
    const pairs = keyring
      .getPairs()
      .filter((account) => !account.meta.isHardware);

    let i = 0;

    // Change passwords of all keys one by one.
    for (i; i < pairs.length; i++) {
      const ret = this._changePassword(pairs[i], oldPass, newPass);

      // If password change for key "i" failed, do NOT change password
      // for the remaining accounts.

      if (!ret) {
        console.error(
          'Changing password of account',
          recodeAddress(pairs[i].address, 12),
          'has failed. Rolling back...'
        );
        break;
      }
    }

    // If one or more attempts to change passwords failed:
    if (i < pairs.length - 1) {
      // Rollback whatever password we managed to change.
      for (let j = 0; j < i; j++) {
        this._changePassword(pairs[j], newPass, oldPass);
      }

      return false;
    }

    return true;
  }

  private async isPasswordSet(): Promise<boolean> {
    // If there's at least one, non-ledger account, or
    // If there's at least one uid stored
    // Then, user has set password before

    const nonLedgerPairs =
      keyring.getPairs().filter((pair) => !pair.meta.isHardware).length > 0;

    if (nonLedgerPairs) return true;

    return false;
  }

  private async validatePassword({
    password,
  }: RequestPolyValidatePassword): Promise<boolean> {
    const nonLedgerPair = keyring
      .getPairs()
      .filter((pair) => !pair.meta.isHardware)[0];

    // Try to validate against an existing pair.
    if (nonLedgerPair) {
      try {
        if (!nonLedgerPair.isLocked) {
          nonLedgerPair.lock();
        }

        nonLedgerPair.decodePkcs8(password);

        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  private _windowOpen(path: AllowedPath): boolean {
    const url = `${chrome.runtime.getURL('index.html')}#${path}`;

    if (!ALLOWED_PATH.includes(path)) {
      console.error('Not allowed to open the url:', url);

      return false;
    }

    chrome.tabs.create({ url });

    return true;
  }

  public async _handle<TMessageType extends PolyMessageTypes>(
    id: string,
    type: TMessageType,
    request: PolyRequestTypes[TMessageType],
    port: chrome.runtime.Port
  ): Promise<PolyResponseType<TMessageType> | ResponseType<MessageTypes>> {
    switch (type) {
      case 'poly:pri(accounts.subscribe)':
        return this.polyAccountsSubscribe(id, port);

      case 'poly:pri(password.isSet)':
        return this.isPasswordSet();

      case 'poly:pri(password.validate)':
        return this.validatePassword(request as RequestPolyValidatePassword);

      case 'poly:pri(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'poly:pri(networkState.subscribe)':
        return this.subscribeNetworkState(id, port);

      case 'poly:pri(network.set)':
        return this.polyNetworkSet(request as RequestPolyNetworkSet);

      case 'poly:pri(network.setCustomNetworkUrl)':
        return this.polyCustomNetworkUrlSet(request as RequestPolyCustomNetworkUrlSet);

      case 'poly:pri(selectedAccount.subscribe)':
        return this.polySelectedAccountSubscribe(id, port);

      case 'poly:pri(selectedAccount.set)':
        return this.polySelectedAccount(
          request as RequestPolySelectedAccountSet
        );

      case 'poly:pri(callDetails.get)':
        return this.polyCallDetailsGet(request as RequestPolyCallDetails);

      case 'poly:pri(status.subscribe)':
        return this.polyStoreStatusSubscribe(id, port);

      case 'poly:pri(identity.rename)':
        return this.polyIdentityRename(request as RequestPolyIdentityRename);

      case 'poly:pri(isDev.toggle)':
        return this.polyIsDevToggle();

      case 'poly:pri(global.changePass)':
        return this.globalChangePassword(
          request as RequestPolyGlobalChangePass
        );

      case 'poly:pri(window.open)':
        return this._windowOpen(request as AllowedPath);

      default:
        return super.handle(
          id,
          type as MessageTypes,
          request as RequestRpcUnsubscribe,
          port
        );
    }
  }
}
