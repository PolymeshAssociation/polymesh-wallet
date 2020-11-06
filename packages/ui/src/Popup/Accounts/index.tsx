import React, { useContext } from 'react';
import styled from 'styled-components';
import { AccountContext, PolymeshContext } from '../../components';
import AddAccount from './AddAccount';
import { AccountsHeader } from './AccountsHeader';
import { Text, Box, Header, Flex, Icon, Menu, MenuItem, ContextMenuTrigger, StatusBadge, GrowingButton } from '../../ui';
import { SvgViewDashboard,
  SvgDotsVertical,
  SvgPlus } from '@polymathnetwork/extension-ui/assets/images/icons';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { AccountsContainer } from './AccountsContainer';
import { hasKey } from '@polymathnetwork/extension-ui/styles/utils';
import { defaultNetwork, networkLabels, networkLinks } from '@polymathnetwork/extension-core/constants';
import { setPolyNetwork, windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { useHistory } from 'react-router';

export default function Accounts (): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);
  const { currentAccount, network, polymeshAccounts, selectedAccount } = useContext(PolymeshContext);
  const history = useHistory();

  const renderNetworksSelector = (network: NetworkName = defaultNetwork) => {
    return (
      <ContextMenuTrigger id='network_select'
        mouseButton={0}>
        <Box style={{ cursor: 'pointer' }}>
          <StatusBadge variant='yellow'>{networkLabels[network]}</StatusBadge>
        </Box>
      </ContextMenuTrigger>
    );
  };

  const renderNetworkDropdown = () => {
    return (
      <>
        {/* @ts-ignore */}
        <Menu id='network_select'>
          {
            Object.keys(networkLabels).map((_network, index) => {
              return (
                <>
                  {/* @ts-ignore */}
                  <MenuItem data={{ networkKey: _network }}
                    key={index}
                    onClick={handleNetworkChange}>{networkLabels[_network as NetworkName]}</MenuItem>
                </>
              );
            })
          }
        </Menu>
      </>
    );
  };

  const getNetworkDashboardLink = () => {
    return networkLinks[network as NetworkName].dashboard;
  };

  const handleNetworkChange = async (event: string, data: {networkKey: NetworkName}) => {
    console.log(data);

    await setPolyNetwork(data.networkKey);
  };

  const groupAccounts = () => (array:IdentifiedAccount[]) =>
    array.reduce((groupedAccounts: Record<string, IdentifiedAccount[]>, account: IdentifiedAccount) => {
      const value = account.did ? account.did : 'unassigned';

      groupedAccounts[value] = (groupedAccounts[value] || []).concat(account);

      return groupedAccounts;
    }, {});

  const groupedAccounts = polymeshAccounts ? groupAccounts()(polymeshAccounts) : {};

  const getHeaderColor = (index: number) => {
    const colors = ['#DCEFFE', '#F2E6FF', '#F1FEE1', '#FFEBF1', '#FFEAE1', '#E6F9FE', '#FAF5FF', '#E6FFFA', '#EBF4FF'];

    return colors[index % (colors.length - 1)];
  };

  const renderAccountMenuItems = () => {
    return (
      <>
        {/* @ts-ignore */}
        <Menu id='add_account_menu'>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'new' }}
            onClick={handleAccountMenuClick}>Create new account</MenuItem>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'fromSeed' }}
            onClick={handleAccountMenuClick}>Restore with recovery phrase</MenuItem>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'fromJson' }}
            onClick={handleAccountMenuClick}>Import account with JSON file</MenuItem>
        </Menu>
      </>
    );
  };

  const handleAccountMenuClick = (event: string, data: {action: string}) => {
    switch (data.action) {
      case 'new':
        return history.push('/account/create');
      case 'fromSeed':
        return history.push('/account/import-seed');
      case 'fromJson':
        return history.push('/account/restore-json');
    }
  };

  const handleTopMenuSelection = (event: string, data: {action: string}) => {
    switch (data.action) {
      case 'changePassword':
        return history.push('/account/change-password');
      case 'newWindow':
        return windowOpen();
    }
  };

  const renderTopMenuButton = () => {
    return (
      <>
        {/* @ts-ignore */}
        <ContextMenuTrigger id='top_menu'
          mouseButton={0}>
          <Icon Asset={SvgDotsVertical}
            color='gray.0'
            height={24}
            width={24} />
        </ContextMenuTrigger>
      </>

    );
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: getNetworkDashboardLink() });
  };

  const renderTopMenu = () => {
    return (
      <>
        {/* @ts-ignore */}
        <Menu id='top_menu'>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'changePassword' }}
            onClick={handleTopMenuSelection}>Change password</MenuItem>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'newWindow' }}
            onClick={handleTopMenuSelection}>Open extension in a new window</MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      {renderTopMenu()}
      {renderAccountMenuItems()}
      {renderNetworkDropdown()}
      {hierarchy.length === 0 ? (
        <AddAccount />
      ) : (
        <>
          <Header>
            <Flex alignItems='center'
              flexDirection='row'
              justifyContent='space-between'
              mb='m'>
              {renderNetworksSelector(network as NetworkName)}
              <Flex flexDirection='row'
                justifyContent='center'>
                <GrowingButton icon={SvgViewDashboard}
                  onClick={openDashboard} />
                {renderTopMenuButton()}
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
              {/* @ts-ignore */}
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
            {
              Object.keys(groupedAccounts).sort((a) => (a === 'unassigned' ? 1 : -1)).map((did: string, index) => {
                return <AccountsContainer
                  accounts={hasKey(groupedAccounts, did) ? groupedAccounts[did] : []}
                  did={did}
                  headerColor={getHeaderColor(index)}
                  key={index}
                  selectedAccount={selectedAccount || ''}
                />;
              })
            }
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
