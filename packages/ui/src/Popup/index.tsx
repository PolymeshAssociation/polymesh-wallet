import { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import uiSettings from '@polkadot/ui-settings';
import { setSS58Format } from '@polkadot/util-crypto';
import { Loading } from '../components';
import { AccountContext, ActionContext, AuthorizeReqContext, MetadataReqContext, SettingsContext, SigningReqContext, PolymeshContext, ActivityContext } from '../components/contexts';
import ToastProvider from '../components/Toast/ToastProvider';
import { subscribeAccounts, subscribePolyIsReady, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribeSigningRequests, subscribePolyAccounts, subscribePolyNetwork, subscribePolySelectedAccount, busySubscriber } from '../messaging';
import { buildHierarchy } from '../util/buildHierarchy';
import Accounts from './Accounts';
import Authorize from './Authorize';
import Derive from './Derive';
import { ExportAccount } from './ExportAccount';
import ImportQr from './ImportQr';
import { ImportSeed } from './ImportSeed';
import Metadata from './Metadata';
import Signing from './Signing';
import Welcome from './Welcome';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { PolymeshContext as PolymeshContextType } from '../types';
import { NewAccount } from './NewAccount';
import { ImportJSon } from './ImportJson';
import { ChangePassword } from './ChangePassword';
import { ForgetAccount } from './ForgetAccount';
import { useErrorHandler } from 'react-error-boundary';
const startSettings = uiSettings.get();

function initAccountContext (accounts: AccountJson[]): AccountsContext {
  const hierarchy = buildHierarchy(accounts);
  const master = hierarchy.find((account) => !account.isExternal);

  return {
    accounts,
    hierarchy,
    master
  };
}

function initPolymeshContext (network: string, polymeshAccounts:IdentifiedAccount[], selectedAccount: string): PolymeshContextType {
  return {
    network,
    polymeshAccounts,
    selectedAccount
  };
}

export default function Popup (): React.ReactElement {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [accountCtx, setAccountCtx] = useState<AccountsContext>({ accounts: [], hierarchy: [] });
  const [polymeshCtx, setPolymeshCtx] = useState<PolymeshContextType>({ network: '', polymeshAccounts: [] });
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [isWelcomeDone, setWelcomeDone] = useState(false);
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [network, setNetwork] = useState('');
  const [polymeshAccounts, setPolymeshAccounts] = useState<IdentifiedAccount[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>();
  const [isPolyReady, setIsPolyReady] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState(false);

  const handleError = useErrorHandler();

  const _onAction = (to?: string): void => {
    setWelcomeDone(window.localStorage.getItem('welcome_read') === 'ok');

    if (to) {
      window.location.hash = to;
    }
  };

  useEffect((): void => {
    Promise.all([
      subscribePolyIsReady(setIsPolyReady),
      subscribePolyAccounts(setPolymeshAccounts),
      subscribePolyNetwork(setNetwork),
      subscribePolySelectedAccount(setSelectedAccountAddress),
      subscribeAccounts(setAccounts),
      subscribeAuthorizeRequests(setAuthRequests),
      subscribeMetadataRequests(setMetaRequests),
      subscribeSigningRequests(setSignRequests),
      busySubscriber.addListener(setIsBusy)
    ])
      .then(() => undefined, handleError)
      .catch(handleError);

    uiSettings.on('change', (settings): void => {
      setSettingsCtx(settings);
      setSS58Format(settings.prefix === -1 ? 42 : settings.prefix);
    });

    _onAction();
  }, [handleError]);

  useEffect((): void => {
    setAccountCtx(initAccountContext(accounts || []));
    setPolymeshCtx(initPolymeshContext(network, polymeshAccounts, selectedAccountAddress || ''));
  }, [accounts, network, polymeshAccounts, selectedAccountAddress]);

  const Root = isWelcomeDone
    ? authRequests && authRequests.length
      ? Authorize
      : metaRequests && metaRequests.length
        ? Metadata
        : signRequests && signRequests.length
          ? Signing
          : Accounts
    : Welcome;

  return (
    <Loading>{accounts && authRequests && metaRequests && signRequests && isPolyReady && (
      <ActivityContext.Provider value={isBusy}>
        <ActionContext.Provider value={_onAction}>
          <SettingsContext.Provider value={settingsCtx}>
            <AccountContext.Provider value={accountCtx}>
              <AuthorizeReqContext.Provider value={authRequests}>
                <MetadataReqContext.Provider value={metaRequests}>
                  <SigningReqContext.Provider value={signRequests}>
                    <PolymeshContext.Provider value={polymeshCtx}>
                      <ToastProvider>
                        <Switch>
                          <Route path='/account/create'><NewAccount /></Route>
                          <Route path='/account/forget/:address'><ForgetAccount /></Route>
                          <Route path='/account/export/:address'><ExportAccount /></Route>
                          <Route path='/account/import-qr'><ImportQr /></Route>
                          <Route path='/account/import-seed'><ImportSeed /></Route>
                          <Route path='/account/restore-json'><ImportJSon /></Route>
                          <Route path='/account/derive/:address/locked'><Derive isLocked /></Route>
                          <Route path='/account/derive/:address'><Derive /></Route>
                          <Route path='/account/change-password'><ChangePassword /></Route>
                          <Route
                            exact
                            path='/'
                          >
                            <Root />
                          </Route>
                        </Switch>
                      </ToastProvider>
                    </PolymeshContext.Provider>
                  </SigningReqContext.Provider>
                </MetadataReqContext.Provider>
              </AuthorizeReqContext.Provider>
            </AccountContext.Provider>
          </SettingsContext.Provider>
        </ActionContext.Provider>
      </ActivityContext.Provider>
    )}</Loading>
  );
}
