import { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import uiSettings from '@polkadot/ui-settings';
import { setSS58Format } from '@polkadot/util-crypto';

import { Loading } from '../components';
import { AccountContext, ActionContext, AuthorizeReqContext, MediaContext, MetadataReqContext, SettingsContext, SigningReqContext, PolymeshContext } from '../components/contexts';
import ToastProvider from '../components/Toast/ToastProvider';
import { subscribeAccounts, subscribePolyIsReady, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribeSigningRequests, subscribePolyAccounts, subscribePolyNetwork, subscribePolySelectedAccount } from '../messaging';
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
const startSettings = uiSettings.get();

// Request permission for video, based on access we can hide/show import
async function requestMediaAccess (cameraOn: boolean): Promise<boolean> {
  if (!cameraOn) {
    return false;
  }

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    return true;
  } catch (error) {
    console.error('Permission for video declined', (error as Error).message);
  }

  return false;
}

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
  const [cameraOn, setCameraOn] = useState(startSettings.camera === 'on');
  const [mediaAllowed, setMediaAllowed] = useState(false);
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [isWelcomeDone, setWelcomeDone] = useState(false);
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [network, setNetwork] = useState('');
  const [polymeshAccounts, setPolymeshAccounts] = useState<IdentifiedAccount[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>();
  const [isPolyReady, setIsPolyReady] = useState<boolean>(false);

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
      subscribeSigningRequests(setSignRequests)
    ]).catch(console.error);

    uiSettings.on('change', (settings): void => {
      setSettingsCtx(settings);
      setCameraOn(settings.camera === 'on');
      setSS58Format(settings.prefix === -1 ? 42 : settings.prefix);
    });

    _onAction();
  }, []);

  useEffect((): void => {
    setAccountCtx(initAccountContext(accounts || []));
    setPolymeshCtx(initPolymeshContext(network, polymeshAccounts, selectedAccountAddress || ''));
  }, [accounts, network, polymeshAccounts, selectedAccountAddress]);

  useEffect((): void => {
    requestMediaAccess(cameraOn)
      .then(setMediaAllowed)
      .catch(console.error);
  }, [cameraOn]);

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
      <ActionContext.Provider value={_onAction}>
        <SettingsContext.Provider value={settingsCtx}>
          <AccountContext.Provider value={accountCtx}>
            <AuthorizeReqContext.Provider value={authRequests}>
              <MediaContext.Provider value={cameraOn && mediaAllowed}>
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
              </MediaContext.Provider>
            </AuthorizeReqContext.Provider>
          </AccountContext.Provider>
        </SettingsContext.Provider>
      </ActionContext.Provider>
    )}</Loading>
  );
}
