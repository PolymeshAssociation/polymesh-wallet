import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { SvgPlus } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector/types';
import useIsPopup from '@polymathnetwork/extension-ui/hooks/useIsPopup';
import { useLedger } from '@polymathnetwork/extension-ui/hooks/useLedger';
import { windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { hasKey } from '@polymathnetwork/extension-ui/styles/utils';
import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { AccountContext, OptionSelector, PolymeshContext } from '../../components';
import { Flex, Icon, Text } from '../../ui';
import { AppHeader } from '../AppHeader';
import { AccountMain } from './AccountMain';
import { AccountsContainer } from './AccountsContainer';
import AddAccount from './AddAccount';

const jsonPath = '/account/restore/json';
const ledgerPath = '/account/import-ledger';

export default function Accounts (): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);
  const { currentAccount,
    polymeshAccounts,
    selectedAccount } = useContext(PolymeshContext);
  const history = useHistory();
  const { isLedgerCapable, isLedgerEnabled } = useLedger();

  const isPopup = useIsPopup();

  const _openJson = useCallback(() => windowOpen(jsonPath), []);

  const _onOpenLedgerConnect = useCallback(() => windowOpen(ledgerPath), []);

  const groupAccounts = () => (array: IdentifiedAccount[]) =>
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

  const accountMenuItems: Option[] = [
    {
      menu: [
        { label: 'Create new account', value: 'new' },
        { label: 'Restore with recovery phrase', value: 'fromSeed' },
        { label: 'Import account with JSON file', value: 'fromJson' },
        // @TODO to be re-enabled once Polymesh Ledger app is released.
        // eslint-disable-next-line no-constant-condition
        ...(false && isLedgerEnabled
          ? [
            {
              label: isLedgerCapable
                ? 'Attach ledger account'
                : 'Ledger devices can only be connected with Chrome browser',
              value: 'fromLedger'
              // @TODO: add "disabled" option feature in OptionSelector
              // disabled: !isLedgerCapable
            },
            { label: 'Connect Ledger device', value: 'connectLedger' }
          ]
          : [])
      ]
    }
  ];

  const handleAccountMenuClick = (value: string) => {
    switch (value) {
      case 'new':
        return history.push('/account/create');
      case 'fromSeed':
        return history.push('/account/restore/seed');
      case 'fromJson':
        return isPopup ? _openJson() : history.push(jsonPath);
      case 'fromLedger':
        return history.push('/account/import-ledger');
      case 'connectLedger':
        return _onOpenLedgerConnect();
    }
  };

  return (
    <>
      {hierarchy.length === 0
        ? <AddAccount />
        : (
          <>
            <AppHeader>
              {currentAccount && <AccountMain account={currentAccount}
                details={true} />}
            </AppHeader>
            <AccountsArea id='accounts-container'>
              <Flex
                justifyContent='space-between'
                pt='m'
                px='s'>
                <Text color='gray.1'
                  variant='c2'>
                ACCOUNTS
                </Text>
                <OptionSelector
                  className='add-key-menu'
                  onSelect={handleAccountMenuClick}
                  options={accountMenuItems}
                  position='bottom-right'
                  selector={
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
                  }
                />
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
