import { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import uiSettings from '@polkadot/ui-settings';
import { SettingsStruct } from '@polkadot/ui-settings/types';
import { setSS58Format } from '@polkadot/util-crypto';
import { ProofingRequest, ProvideUidRequest, ReadUidRequest } from '@polymathnetwork/extension-core/background/types';
import { defaultNetworkState } from '@polymathnetwork/extension-core/constants';
import { ErrorCodes, IdentifiedAccount, NetworkState, StoreStatus, UidRecord } from '@polymathnetwork/extension-core/types';
import { subscribeOnlineStatus } from '@polymathnetwork/extension-core/utils';
import React, { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Route, Switch } from 'react-router';
import { toast } from 'react-toastify';

import { SvgCloseCircle } from '../assets/images/icons';
import { Loading } from '../components';
import { AccountContext, ActionContext, ActivityContext, AuthorizeReqContext, MetadataReqContext, PolymeshContext, ProofReqContext, ProvideUidReqContext, ReadUidReqContext, SettingsContext, SigningReqContext, UidContext } from '../components/contexts';
import { busySubscriber, subscribeAccounts, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribeNetworkState, subscribePolyAccounts, subscribePolySelectedAccount, subscribePolyStatus, subscribeProofingRequests, subscribeProvideUidRequests, subscribeReadUidRequests, subscribeSigningRequests, subscribeUidRecords } from '../messaging';
import { PolymeshContext as PolymeshContextType } from '../types';
import { Box, Flex, Icon } from '../ui';
import { Toast } from '../ui/Toast';
import { buildHierarchy } from '../util/buildHierarchy';
import ImportLedger from './ImportLedger/ImportLedger';
import { AccountDetails } from './AccountDetails';
import Accounts from './Accounts';
import { AuthManagement } from './AuthManagement';
import Authorize from './Authorize';
import { ChangePassword } from './ChangePassword';
import { ExportAccount } from './ExportAccount';
import { ForgetAccount } from './ForgetAccount';
import { NewAccount } from './NewAccount';
import ProofRequests from './ProofRequests';
import ProvideUidRequests from './ProvideUidRequests';
import ReadUidRequests from './ReadUidRequests';
import { Restore } from './Restore';
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

function initPolymeshContext (
  networkState: NetworkState,
  polymeshAccounts: IdentifiedAccount[],
  selectedAccount: string,
  currentAccount?: IdentifiedAccount

): PolymeshContextType {
  return {
    networkState,
    polymeshAccounts,
    selectedAccount,
    currentAccount
  };
}

export default function Popup (): React.ReactElement {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [accountCtx, setAccountCtx] = useState<AccountsContext>({ accounts: [], hierarchy: [] });
  const [polymeshCtx, setPolymeshCtx] = useState<PolymeshContextType>({ networkState: defaultNetworkState, polymeshAccounts: [] });
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(null);
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(null);
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(null);
  const [proofingRequests, setProofingRequests] = useState<null | ProofingRequest[]>(null);
  const [provideUidRequests, setProvideUidRequests] = useState<null | ProvideUidRequest[]>(null);
  const [readUidRequests, setReadUidRequests] = useState<null | ReadUidRequest[]>(null);
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [polymeshAccounts, setPolymeshAccounts] = useState<IdentifiedAccount[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>();
  const [uidRecords, setUidRecords] = useState<null | UidRecord[]>(null);
  const [status, setStatus] = useState<undefined | StoreStatus>();
  const [isBusy, setIsBusy] = useState(false);
  const [networkState, setNetworkState] = useState<NetworkState>(defaultNetworkState);
  const handleError = useErrorHandler();

  useEffect(() => {
    if (status?.error) {
      if (status.error.code === ErrorCodes.FatalError) {
        // Fatal errors render the app useless. Display the error in an ErrorBoundaryFallback.
        handleError((status.error as unknown) as (prevState: Error | null) => Error);
      } else {
        // Otherwise, we just inform the user via a Toast component.
        toast.error(
          <Flex>
            <Icon
              Asset={SvgCloseCircle}
              color='red.0'
              height={20}
              width={20}
            />
            <Box ml='s'>{status.error.msg}</Box>
          </Flex>,
          { autoClose: false, toastId: 'error', closeButton: true }
        );
      }
    } else {
      toast.dismiss('error');
    }
  }, [handleError, status?.error]);

  useEffect(() => {
    subscribeOnlineStatus((isOnline: boolean) => {
      if (isOnline) {
        // Dismiss any toast that we might've displayed earlier.
        toast.dismiss('offline');
      } else {
        // Show an alert about lack of connectivity.
        toast.error(
          <Flex>
            <Icon
              Asset={SvgCloseCircle}
              color='red.0'
              height={20}
              width={20}
            />
            <Box ml='s'>No internet connection</Box>
          </Flex>
          , { toastId: 'offline', autoClose: false, closeButton: true });
      }
    });
  }, []);

  const _onAction = (to?: string): void => {
    if (to) {
      window.location.hash = to;
    }
  };

  useEffect((): void => {
    // @ts-ignore
    Promise.all([
      subscribePolyStatus(setStatus),
      subscribePolyAccounts(setPolymeshAccounts),
      subscribePolySelectedAccount(setSelectedAccountAddress),
      subscribeNetworkState(setNetworkState),
      subscribeAccounts(setAccounts),
      subscribeAuthorizeRequests(setAuthRequests),
      subscribeMetadataRequests(setMetaRequests),
      subscribeSigningRequests(setSignRequests),
      subscribeProofingRequests(setProofingRequests),
      subscribeProvideUidRequests(setProvideUidRequests),
      subscribeReadUidRequests(setReadUidRequests),
      subscribeUidRecords(setUidRecords),
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
    const currentAccount =
      selectedAccountAddress && polymeshAccounts
        ? polymeshAccounts.find((account) => account.address === selectedAccountAddress)
        : undefined;

    setAccountCtx(initAccountContext(accounts || []));
    setPolymeshCtx(
      initPolymeshContext(networkState, polymeshAccounts, selectedAccountAddress || '', currentAccount)
    );
  }, [accounts, networkState, polymeshAccounts, selectedAccountAddress
  ]);

  const Root = (() => {
    if (authRequests && authRequests.length) {
      return Authorize;
    } else if (proofingRequests && proofingRequests.length) {
      return ProofRequests;
    } else if (signRequests && signRequests.length) {
      return Signing;
    } else if (provideUidRequests && provideUidRequests.length) {
      return ProvideUidRequests;
    } else if (readUidRequests && readUidRequests.length) {
      return ReadUidRequests;
    }

    return Accounts;
  })();

  // We show a spinner until
  // A) there's an error that we need to display, or
  // B) API is ready, and
  //   B1) Accounts list is empty. ie this an empty wallet, or
  //   B2) Redux store is populated.
  const isReady = status?.apiStatus !== 'connecting' &&
  (status?.populated[networkState.selected] || accounts?.length === 0 || status?.apiStatus === 'error');

  return (
    <Loading>
      { accounts &&
        authRequests &&
        metaRequests &&
        signRequests &&
        proofingRequests &&
        provideUidRequests &&
        readUidRequests &&
        uidRecords &&
        isReady && (
        <ActivityContext.Provider value={isBusy}>
          <ActionContext.Provider value={_onAction}>
            <SettingsContext.Provider value={settingsCtx}>
              <AccountContext.Provider value={accountCtx}>
                <UidContext.Provider value={uidRecords}>
                  <AuthorizeReqContext.Provider value={authRequests}>
                    <MetadataReqContext.Provider value={metaRequests}>
                      <SigningReqContext.Provider value={signRequests}>
                        <ProofReqContext.Provider value={proofingRequests}>
                          <ProvideUidReqContext.Provider value={provideUidRequests}>
                            <ReadUidReqContext.Provider value={readUidRequests}>
                              <PolymeshContext.Provider value={polymeshCtx}>
                                <Switch>
                                  <Route path='/account/create'>
                                    <NewAccount />
                                  </Route>
                                  <Route path='/account/forget/:address'>
                                    <ForgetAccount />
                                  </Route>
                                  <Route path='/account/export/:address'>
                                    <ExportAccount />
                                  </Route>
                                  <Route path='/account/restore/:method'>
                                    <Restore />
                                  </Route>
                                  <Route path='/account/import-ledger'>
                                    <ImportLedger />
                                  </Route>
                                  <Route path='/account/change-password'>
                                    <ChangePassword />
                                  </Route>
                                  <Route path='/account/details/:address'>
                                    <AccountDetails />
                                  </Route>
                                  <Route path='/settings/url-auth'>
                                    <AuthManagement />
                                  </Route>
                                  <Route
                                    exact
                                    path='/'
                                  >
                                    <Root />
                                  </Route>
                                </Switch>
                                <Toast />
                              </PolymeshContext.Provider>
                            </ReadUidReqContext.Provider>
                          </ProvideUidReqContext.Provider>
                        </ProofReqContext.Provider>
                      </SigningReqContext.Provider>
                    </MetadataReqContext.Provider>
                  </AuthorizeReqContext.Provider>
                </UidContext.Provider>
              </AccountContext.Provider>
            </SettingsContext.Provider>
          </ActionContext.Provider>
        </ActivityContext.Provider>
      )}
    </Loading>
  );
}
