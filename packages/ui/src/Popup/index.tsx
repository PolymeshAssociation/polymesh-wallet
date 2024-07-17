import type { AccountJson, AccountsContext, AuthorizeRequest, MetadataRequest, SigningRequest } from '@polkadot/extension-base/background/types';
import type { SettingsStruct } from '@polkadot/ui-settings/types';
import type { IdentifiedAccount, NetworkState, StoreStatus } from '@polymeshassociation/extension-core/types';
import type { PolymeshContext as PolymeshContextType } from '../types';

import uiSettings from '@polkadot/ui-settings';
import React, { useCallback, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Route, Switch, useHistory } from 'react-router';
import { toast } from 'react-toastify';

import { defaultNetworkState } from '@polymeshassociation/extension-core/constants';
import { ErrorCodes } from '@polymeshassociation/extension-core/types';
import { subscribeOnlineStatus } from '@polymeshassociation/extension-core/utils';

import { SvgCloseCircle } from '../assets/images/icons';
import { Loading } from '../components';
import { AccountContext, ActionContext, ActivityContext, AuthorizeReqContext, MetadataReqContext, PolymeshContext, SettingsContext, SigningReqContext } from '../components/contexts';
import { busySubscriber, ping, subscribeAccounts, subscribeAuthorizeRequests, subscribeMetadataRequests, subscribeNetworkState, subscribePolyAccounts, subscribePolySelectedAccount, subscribePolyStatus, subscribeSigningRequests } from '../messaging';
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
    currentAccount,
    networkState,
    polymeshAccounts,
    selectedAccount
  };
}

export default function Popup (): React.ReactElement {
  const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
  const [accountCtx, setAccountCtx] = useState<AccountsContext>({
    accounts: [],
    hierarchy: []
  });
  const [polymeshCtx, setPolymeshCtx] = useState<PolymeshContextType>({
    networkState: defaultNetworkState,
    polymeshAccounts: []
  });
  const [authRequests, setAuthRequests] = useState<null | AuthorizeRequest[]>(
    null
  );
  const [metaRequests, setMetaRequests] = useState<null | MetadataRequest[]>(
    null
  );
  const [signRequests, setSignRequests] = useState<null | SigningRequest[]>(
    null
  );
  const [settingsCtx, setSettingsCtx] = useState<SettingsStruct>(startSettings);
  const [polymeshAccounts, setPolymeshAccounts] = useState<IdentifiedAccount[]>(
    []
  );
  const [selectedAccountAddress, setSelectedAccountAddress] =
    useState<string>();
  const [status, setStatus] = useState<undefined | StoreStatus>();
  const [isBusy, setIsBusy] = useState(false);
  const [networkState, setNetworkState] =
    useState<NetworkState>(defaultNetworkState);
  const handleError = useErrorHandler();
  const history = useHistory();

  useEffect(() => {
    if (status?.error) {
      if (status.error.code === ErrorCodes.FatalError) {
        // Fatal errors render the app useless. Display the error in an ErrorBoundaryFallback.
        handleError(
          status.error as unknown as (prevState: Error | null) => Error
        );
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
          { autoClose: false, closeButton: true, toastId: 'error' }
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
          </Flex>,
          { autoClose: false, closeButton: true, toastId: 'offline' }
        );
      }
    });
  }, []);

  const _onAction = useCallback(
    (to?: string): void => {
      if (!to) {
        return;
      }

      to === '../index.js'
        // if we can't go back from there, go to the home
        ? history.length === 1
          ? history.push('/')
          : history.goBack()
        : window.location.hash = to;
    },
    [history]
  );

  useEffect((): void => {
    // initially send a ping message to create a port that will be reused for subsequent
    // messages. This ensure onConnect event is fired only once
    ping()
      .then(() =>
        Promise.all([
          subscribePolyStatus(setStatus),
          subscribePolyAccounts(setPolymeshAccounts),
          subscribePolySelectedAccount(setSelectedAccountAddress),
          subscribeNetworkState(setNetworkState),
          subscribeAccounts(setAccounts),
          subscribeAuthorizeRequests(setAuthRequests),
          subscribeMetadataRequests(setMetaRequests),
          subscribeSigningRequests(setSignRequests),
          busySubscriber.addListener(setIsBusy)
        ])
      )
      .then(() => undefined, handleError)
      .catch(handleError);

    uiSettings.on('change', (settings): void => {
      setSettingsCtx(settings);
    });

    _onAction();
  }, [_onAction, handleError]);

  useEffect((): void => {
    const currentAccount =
      selectedAccountAddress && polymeshAccounts
        ? polymeshAccounts.find(
          (account) => account.address === selectedAccountAddress
        )
        : undefined;

    setAccountCtx(initAccountContext(accounts || []));
    setPolymeshCtx(
      initPolymeshContext(
        networkState,
        polymeshAccounts,
        selectedAccountAddress || '',
        currentAccount
      )
    );
  }, [accounts, networkState, polymeshAccounts, selectedAccountAddress]);

  const Root = (() => {
    if (authRequests?.length) {
      return Authorize;
    } else if (signRequests?.length) {
      return Signing;
    }

    return Accounts;
  })();

  // We show a spinner until
  // A) there's an error that we need to display, or
  // B) API is ready, and
  //   B1) Accounts list is empty. ie this an empty wallet, or
  //   B2) Redux store is populated.
  const isReady =
    status?.apiStatus !== 'connecting' &&
    (status?.populated[networkState.selected] ||
      accounts?.length === 0 ||
      status?.apiStatus === 'error');

  return (
    <Loading>
      {accounts &&
        authRequests &&
        metaRequests &&
        signRequests &&
        isReady && (
        <ActivityContext.Provider value={isBusy}>
          <ActionContext.Provider value={_onAction}>
            <SettingsContext.Provider value={settingsCtx}>
              <AccountContext.Provider value={accountCtx}>
                <AuthorizeReqContext.Provider value={authRequests}>
                  <MetadataReqContext.Provider value={metaRequests}>
                    <SigningReqContext.Provider value={signRequests}>
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
                    </SigningReqContext.Provider>
                  </MetadataReqContext.Provider>
                </AuthorizeReqContext.Provider>
              </AccountContext.Provider>
            </SettingsContext.Provider>
          </ActionContext.Provider>
        </ActivityContext.Provider>
      )}
    </Loading>
  );
}
