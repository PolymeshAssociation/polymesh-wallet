import { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import uiSettings from '@polkadot/ui-settings';
import { SettingsStruct } from '@polkadot/ui-settings/types';
import { setSS58Format } from '@polkadot/util-crypto';
import { ProofingRequest } from '@polymathnetwork/extension-core/background/types';
import { ErrorCodes, IdentifiedAccount, StoreStatus } from '@polymathnetwork/extension-core/types';
import { subscribeOnlineStatus } from '@polymathnetwork/extension-core/utils';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Route, Switch } from 'react-router';
import { toast } from 'react-toastify';

import { SvgCloseCircle } from '../assets/images/icons';
import { Loading } from '../components';
import { AccountContext, ActionContext, ActivityContext, AuthorizeReqContext, MetadataReqContext, PolymeshContext, ProofReqContext, SettingsContext, SigningReqContext } from '../components/contexts';
import { busySubscriber, subscribeAccounts, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribePolyAccounts, subscribePolyIsDev, subscribePolyNetwork, subscribePolySelectedAccount, subscribePolyStatus, subscribeProofingRequests, subscribeSigningRequests } from '../messaging';
import { PolymeshContext as PolymeshContextType } from '../types';
import { Box, Flex, Icon } from '../ui';
import { Toast } from '../ui/Toast';
import { buildHierarchy } from '../util/buildHierarchy';
import { AccountDetails } from './AccountDetails';
import Accounts from './Accounts';
import Authorize from './Authorize';
import { ChangePassword } from './ChangePassword';
import { ExportAccount } from './ExportAccount';
import { ForgetAccount } from './ForgetAccount';
import { ImportJson } from './ImportJson';
import { ImportSeed } from './ImportSeed';
import { NewAccount } from './NewAccount';
import Proofs from './Proofs';
import Signing from './Signing';

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

function initPolymeshContext (network: string, polymeshAccounts:IdentifiedAccount[], selectedAccount: string, isDeveloper: boolean, currentAccount?: IdentifiedAccount): PolymeshContextType {
  return {
    network,
    polymeshAccounts,
    selectedAccount,
    currentAccount,
    isDeveloper
  };
}

export default function Popup (): React.ReactElement {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [accountCtx, setAccountCtx] = useState<AccountsContext>({ accounts: [], hierarchy: [] });
  const [polymeshCtx, setPolymeshCtx] = useState<PolymeshContextType>({ network: '', polymeshAccounts: [] });
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [proofingRequests, setProofingRequests] = useState<ProofingRequest[]>([]);
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [network, setNetwork] = useState('');
  const [polymeshAccounts, setPolymeshAccounts] = useState<IdentifiedAccount[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>();
  const [status, setStatus] = useState<undefined | StoreStatus>();
  const [isBusy, setIsBusy] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const handleError = useErrorHandler();

  useEffect(() => {
    if (status?.error) {
      if (status.error.code === ErrorCodes.FatalError) {
        // Fatal errors render the app useless. Display the error in an ErrorBoundaryFallback.
        handleError(status.error as unknown as (prevState: Error | null) => Error);
      } else {
        // Otherwise, we just inform the user via a Toast component.
        toast.error(
          <Flex>
            <Icon Asset={SvgCloseCircle}
              color='red.0'
              height={20}
              width={20} />
            <Box ml='s'>{status.error.msg}</Box>
          </Flex>
          , { autoClose: false, toastId: 'error' });
      }
    } else {
      toast.dismiss('error');
    }
  }, [handleError, status?.error]);

  useEffect(() => {
    subscribeOnlineStatus((status: boolean) => {
      if (status) {
        // Dismiss any toast that we might've displayed earlier.
        toast.dismiss('offline');
      } else {
        // Show an un-closable alert about lack of connectivity.
        toast.error(
          <Flex>
            <Icon Asset={SvgCloseCircle}
              color='red.0'
              height={20}
              width={20} />
            <Box ml='s'>No internet!</Box>
          </Flex>
          , { toastId: 'offline', autoClose: false, closeButton: false });
      }
    });
  }, []);

  const _onAction = (to?: string): void => {
    if (to) {
      window.location.hash = to;
    }
  };

  useEffect((): void => {
    Promise.all([
      subscribePolyStatus(setStatus),
      subscribePolyAccounts(setPolymeshAccounts),
      subscribePolyNetwork(setNetwork),
      subscribePolySelectedAccount(setSelectedAccountAddress),
      subscribePolyIsDev((isDev) => {
        setIsDeveloper(isDev === 'true');
      }),
      subscribeAccounts(setAccounts),
      subscribeAuthorizeRequests(setAuthRequests),
      subscribeMetadataRequests(setMetaRequests),
      subscribeSigningRequests(setSignRequests),
      subscribeProofingRequests(setProofingRequests),
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
    const currentAccount = selectedAccountAddress && polymeshAccounts
      ? polymeshAccounts.find((account) => (account.address === selectedAccountAddress))
      : undefined;

    setAccountCtx(initAccountContext(accounts || []));
    setPolymeshCtx(initPolymeshContext(network, polymeshAccounts, selectedAccountAddress || '', isDeveloper, currentAccount));
  }, [accounts, network, polymeshAccounts, selectedAccountAddress, isDeveloper]);

  const Root = authRequests && authRequests.length
    ? Authorize
    : proofingRequests && proofingRequests.length
      ? Proofs
      : signRequests && signRequests.length
        ? Signing
        : Accounts;

  return (
    <Loading>{accounts && authRequests && metaRequests && signRequests && proofingRequests && (status?.error || status?.ready) && (
      <ActivityContext.Provider value={isBusy}>
        <ActionContext.Provider value={_onAction}>
          <SettingsContext.Provider value={settingsCtx}>
            <AccountContext.Provider value={accountCtx}>
              <AuthorizeReqContext.Provider value={authRequests}>
                <MetadataReqContext.Provider value={metaRequests}>
                  <SigningReqContext.Provider value={signRequests}>
                    <ProofReqContext.Provider value={proofingRequests}>
                      <PolymeshContext.Provider value={polymeshCtx}>
                        <Switch>
                          <Route path='/account/create'><NewAccount /></Route>
                          <Route path='/account/forget/:address'><ForgetAccount /></Route>
                          <Route path='/account/export/:address'><ExportAccount /></Route>
                          <Route path='/account/import-seed'><ImportSeed /></Route>
                          <Route path='/account/restore-json'><ImportJson /></Route>
                          <Route path='/account/change-password'><ChangePassword /></Route>
                          <Route path='/account/details/:address'><AccountDetails /></Route>
                          <Route
                            exact
                            path='/'
                          >
                            <Root />
                          </Route>
                        </Switch>
                        <Toast />
                      </PolymeshContext.Provider>
                    </ProofReqContext.Provider>
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
