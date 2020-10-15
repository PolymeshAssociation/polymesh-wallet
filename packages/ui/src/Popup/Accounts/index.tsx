import React, { useContext } from 'react';
import styled from 'styled-components';
import { AccountContext, Dropdown, PolymeshContext } from '../../components';
import AddAccount from './AddAccount';
import AccountsHeader from './AccountsHeader';
import { Button } from 'react-aria-menubutton';
import { Text, Box, Header, Flex, Icon, Menu, MenuItem, Wrapper } from '../../ui';
import { SvgViewDashboard,
  SvgDotsVertical,
  SvgPlus } from '@polymathnetwork/extension-ui/assets/images/icons';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { AccountsContainer } from './AccountsContainer';
import { hasKey } from '@polymathnetwork/extension-ui/styles/utils';
import { defaultNetwork, networkLabels } from '@polymathnetwork/extension-core/constants';
import { setPolyNetwork, windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { useHistory } from 'react-router';

export default function Accounts (): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);
  const { currentAccount, network, polymeshAccounts, selectedAccount } = useContext(PolymeshContext);
  const history = useHistory();

  const renderNetworksSelector = (network: NetworkName = defaultNetwork) => {
    const options = Object.keys(networkLabels).map((_network: string) =>
      ({
        value: _network,
        text: networkLabels[_network as NetworkName]
      })
    );

    return (
      <Dropdown
        label=''
        onChange={handleNetworkChange}
        options={options}
        value={network}
      />
    );
  };

  const handleNetworkChange = (value: string) => {
    setPolyNetwork(value as NetworkName).then(() => {
      // @TODO Handle this properly. Perhaps by showing a Loader until this promise has resolved?
    }).catch(console.error);
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
        <MenuItem value='new'>Create new account</MenuItem>
        {/* @ts-ignore */}
        <MenuItem value='fromSeed'>Import from seed</MenuItem>
        {/* @ts-ignore */}
        <MenuItem value='fromJson'>Restore  from JSON</MenuItem>
      </>
    );
  };

  const handleAccountMenuClick = (event: string) => {
    switch (event) {
      case 'new':
        return history.push('/account/create');
      case 'fromSeed':
        return history.push('/account/import-seed');
      case 'fromJson':
        return history.push('/account/restore-json');
    }
  };

  const renderTopMenuButton = () => {
    const _handleSelection = (event: string) => {
      switch (event) {
        case 'changePassword':
          return history.push('/account/change-password');
        case 'newWindow':
          return windowOpen();
      }
    };

    return (
      <>
        {/* @ts-ignore */}
        <Wrapper onSelection={_handleSelection}>
          <Button>
            <Icon Asset={SvgDotsVertical}
              color='gray.0'
              height={24}
              width={24} />
          </Button>
          {/* @ts-ignore */}
          <Menu>
            {/* @ts-ignore */}
            <MenuItem value='changePassword'>Change password</MenuItem>
            {/* @ts-ignore */}
            <MenuItem value='newWindow'>Open extension in a new window</MenuItem>
          </Menu>
        </Wrapper>
      </>

    );
  };

  return (
    <>
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
                <Icon Asset={SvgViewDashboard}
                  color='gray.0'
                  height={24}
                  width={24} />
                {renderTopMenuButton()}
              </Flex>
            </Flex>
            {currentAccount && <AccountsHeader account={currentAccount}
              details={false} />}
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
              <Wrapper onSelection={handleAccountMenuClick}>
                <Button>
                  <Flex justifyContent='center'>
                    <Box mx='s'>
                      <Icon Asset={SvgPlus}
                        color='brandMain'
                        height={14}
                        width={14} />
                    </Box>
                    <Text color='brandMain'
                      variant='b2'>
                      Add a key
                    </Text>
                  </Flex>
                </Button>
                {/* @ts-ignore */}
                <Menu>{renderAccountMenuItems()}</Menu>
              </Wrapper>
            </Flex>
            {
              Object.keys(groupedAccounts).sort((a) => (a === 'unassigned' ? 1 : -1)).map((did: string, index) => {
                return <AccountsContainer
                  accounts={hasKey(groupedAccounts, did) ? groupedAccounts[did] : []}
                  headerColor={getHeaderColor(index)}
                  headerText={did}
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
