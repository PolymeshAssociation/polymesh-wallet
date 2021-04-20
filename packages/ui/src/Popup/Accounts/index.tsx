import { networkLinks } from '@polymathnetwork/extension-core/constants';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgDotsVertical, SvgPlus, SvgViewDashboard } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector';
import useIsPopup from '@polymathnetwork/extension-ui/hooks/useIsPopup';
import { useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { setPolyNetwork, togglePolyIsDev, windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { hasKey } from '@polymathnetwork/extension-ui/styles/utils';
import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { AccountContext, OptionSelector, PolymeshContext } from '../../components';
import { Box, Checkbox, ContextMenuTrigger, Flex, GrowingButton, Header, Icon, Menu, MenuItem, Text } from '../../ui';
import { AccountsContainer } from './AccountsContainer';
import { AccountsHeader } from './AccountsHeader';
import AddAccount from './AddAccount';
import { NetworkSelector } from './NetworkSelector';

const jsonPath = '/account/restore-json';
const ledgerPath = '/account/import-ledger';

export default function Accounts (): React.ReactElement {
  const { accounts, hierarchy } = useContext(AccountContext);
  const { currentAccount,
    networkState: { isDeveloper, selected: network },
    polymeshAccounts,
    selectedAccount } = useContext(PolymeshContext);
  const history = useHistory();
  const { isLedgerCapable, isLedgerEnabled } = useLedger();

  const isPopup = useIsPopup();

  const _openJson = useCallback(() => windowOpen(jsonPath), []);

  const _onOpenLedgerConnect = useCallback(() => windowOpen(ledgerPath), []);

  const getNetworkDashboardLink = () => {
    return networkLinks[network].dashboard;
  };

  const groupAccounts = () => (array: IdentifiedAccount[]) =>
    array.reduce((groupedAccounts: Record<string, IdentifiedAccount[]>, account: IdentifiedAccount) => {
      const value = account.did ? account.did : 'unassigned';

      groupedAccounts[value] = (groupedAccounts[value] || []).concat(account);

      return groupedAccounts;
    }, {});

  const setNetwork = async (_network: NetworkName) => {
    if (_network !== network) {
      await setPolyNetwork(_network);
    }
  };

  const groupedAccounts = polymeshAccounts ? groupAccounts()(polymeshAccounts) : {};

  const getHeaderColor = (index: number) => {
    const colors = ['#DCEFFE', '#F2E6FF', '#F1FEE1', '#FFEBF1', '#FFEAE1', '#E6F9FE', '#FAF5FF', '#E6FFFA', '#EBF4FF'];

    return colors[index % (colors.length - 1)];
  };

  const renderAccountMenuItems = () => {
    return (
      <>
        <Menu id='add_account_menu'>
          <MenuItem data={{ action: 'new' }}
            onClick={handleAccountMenuClick}>
            <Text color='gray.2'
              variant='b1'>
              Create new account
            </Text>
          </MenuItem>
          <MenuItem data={{ action: 'fromSeed' }}
            onClick={handleAccountMenuClick}>
            <Text color='gray.2'
              variant='b1'>
              Restore with recovery phrase
            </Text>
          </MenuItem>
          <MenuItem data={{ action: 'fromJson' }}
            onClick={handleAccountMenuClick}>
            <Text color='gray.2'
              variant='b1'>
              Import account with JSON file
            </Text>
          </MenuItem>

          {
            // @TODO to be re-enabled once Polymesh Ledger app is released.
            false &&
              (isLedgerEnabled
                ? (
                  <MenuItem disabled={!isLedgerCapable}
                    onClick={() => history.push('/account/import-ledger')}>
                    <Text color='gray.2'
                      variant='b1'>
                      {!isLedgerCapable
                        ? 'Ledger devices can only be connected with Chrome browser'
                        : 'Attach ledger account'}
                    </Text>
                  </MenuItem>
                )
                : (
                  <MenuItem onClick={_onOpenLedgerConnect}>
                    <Text color='gray.2'
                      variant='b1'>
                      {'Connect Ledger device'}
                    </Text>
                  </MenuItem>
                ))
          }
        </Menu>
      </>
    );
  };

  const handleAccountMenuClick = (event: string, data: { action: string }) => {
    switch (data.action) {
      case 'new':
        return history.push('/account/create');
      case 'fromSeed':
        return history.push('/account/import-seed');
      case 'fromJson':
        return isPopup ? _openJson() : history.push(jsonPath);
    }
  };

  const topMenuOptions: Option[] = [
    {
      menu: [
        { label: 'Change password', value: 'changePassword' },
        { label: 'Open extension in a new tab', value: 'newWindow' },
        {
          label: (
            <Flex px='16px'
              py='8px'>
              <Checkbox checked={isDeveloper}
                disabled />
              <Box ml='s'>
                <Text variant='b2m'>Display development networks</Text>
              </Box>
            </Flex>
          ),
          value: 'toggleIsDev'
        }
      ]
    }
  ];

  const handleTopMenuSelection = (value: string) => {
    switch (value) {
      case 'changePassword':
        return history.push('/account/change-password');
      case 'newWindow':
        return windowOpen('/');
      case 'toggleIsDev':
        return togglePolyIsDev();
    }
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: getNetworkDashboardLink() });
  };

  return (
    <>
      {renderAccountMenuItems()}
      {hierarchy.length === 0
        ? <AddAccount />
        : (
          <>
            <Header>
              <Flex alignItems='center'
                flexDirection='row'
                justifyContent='space-between'
                mb='m'>
                <NetworkSelector currentNetwork={network}
                  onSelect={setNetwork} />
                <Flex flexDirection='row'
                  justifyContent='center'>
                  <GrowingButton icon={SvgViewDashboard}
                    onClick={openDashboard} />
                  <OptionSelector
                    onSelect={handleTopMenuSelection}
                    options={topMenuOptions}
                    position='bottom-right'
                    selector={
                      <Icon Asset={SvgDotsVertical}
                        color='gray.0'
                        height={24}
                        style={{ cursor: 'pointer' }}
                        width={24} />
                    }
                  />
                </Flex>
              </Flex>
              {currentAccount && <AccountsHeader account={currentAccount}
                details={true} />}
            </Header>
            <AccountsArea>
              <Flex justifyContent='space-between'
                pt='m'
                px='s'>
                <Text color='gray.1'
                  variant='c2'>
                ACCOUNTS
                </Text>
                <ContextMenuTrigger id='add_account_menu'
                  mouseButton={0}>
                  <Flex justifyContent='center'
                    style={{ cursor: 'pointer' }}>
                    <Flex mx='s'>
                      <Icon Asset={SvgPlus}
                        color='brandMain'
                        height={14}
                        width={14} />
                    </Flex>
                    <Text color='brandMain'
                      variant='b2'>
                    Add a key
                    </Text>
                  </Flex>
                </ContextMenuTrigger>
              </Flex>
              {Object.keys(groupedAccounts)
                .sort((a) => (a === 'unassigned' ? 1 : -1))
                .map((did: string, index) => {
                  return (
                    <AccountsContainer
                      accounts={hasKey(groupedAccounts, did) ? groupedAccounts[did] : []}
                      did={did}
                      headerColor={getHeaderColor(index)}
                      key={index}
                      selectedAccount={selectedAccount || ''}
                    />
                  );
                })}
            </AccountsArea>
          </>
        )}
    </>
  );
}

const AccountsArea = styled.div`
  height: 100%;
  overflow-y: scroll;
  margin-top: -25px;
  padding-top: 25px;
  padding-right: 0px;
  padding-left: 0px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
