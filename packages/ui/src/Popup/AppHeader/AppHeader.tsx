/* global chrome */

import type { ReactElement } from 'react';
import type { Option } from '@polymeshassociation/extension-ui/components/OptionSelector/types';
import type { HeaderProps } from '@polymeshassociation/extension-ui/ui/Header/Header';

import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router';

import { networkLinks } from '@polymeshassociation/extension-core/constants';
import { SvgDotsVertical, SvgLockOutline, SvgOpenInNew, SvgSettingsOutline, SvgViewDashboard } from '@polymeshassociation/extension-ui/assets/images/icons';
import { AccountContext, OptionSelector, PolymeshContext } from '@polymeshassociation/extension-ui/components';
import useIsPopup from '@polymeshassociation/extension-ui/hooks/useIsPopup';
import { togglePolyIsDev, windowOpen } from '@polymeshassociation/extension-ui/messaging';
import { Checkbox, Flex, GrowingButton, Icon } from '@polymeshassociation/extension-ui/ui';
import { Header } from '@polymeshassociation/extension-ui/ui/Header/Header';

import { NetworkSelector } from '../Accounts/NetworkSelector';

export type Props = HeaderProps;

const AppHeader = (props: Props): ReactElement<Props> => {
  const { accounts } = useContext(AccountContext);
  const { children, ...rest } = props;
  const hasNonHardwareAccount = accounts.some((account) => !account.isHardware);
  const { networkState: { isDeveloper, selected: selectedNetwork } } = useContext(PolymeshContext);
  const history = useHistory();
  const isPopup = useIsPopup();

  const openDashboard = useCallback(() => {
    const url = networkLinks[selectedNetwork].dashboard;

    if (url) {
      chrome.tabs.create({ url }).catch(console.error);
    }
  }, [selectedNetwork]);

  const topMenuOptions: Option[] = [
    {
      menu: [
        ...(hasNonHardwareAccount
          ? [
            {
              icon: (
                <Icon
                  Asset={SvgLockOutline}
                  color='gray5'
                  height={24}
                  width={24}
                />
              ),
              label: 'Change password',
              value: 'changePassword'
            }
          ]
          : []),
        {
          icon: (
            <Icon
              Asset={SvgOpenInNew}
              color='gray5'
              height={24}
              width={24}
            />
          ),
          label: 'Open in a new tab',
          value: 'newWindow'
        },
        {
          icon: (
            <Icon
              Asset={SvgSettingsOutline}
              color='gray5'
              height={24}
              width={24}
            />
          ),
          label: 'Manage connected dApps',
          value: 'manageUrlAuth'
        },
        {
          icon: (
            <Flex
              justifyContent='center'
              width={24}
            >
              <Checkbox
                checked={isDeveloper}
                disabled
              />
            </Flex>
          ),
          label: 'Display development networks',
          value: 'toggleIsDev'
        }
      ]
    }
  ];

  const handleTopMenuSelection = useCallback((value: string) => {
    (async () => {
      switch (value) {
        case 'changePassword':
          return isPopup
            ? windowOpen('/account/change-password')
            : history.push('/account/change-password');
        case 'newWindow':
          return windowOpen('/');
        case 'toggleIsDev':
          return togglePolyIsDev();
        case 'manageUrlAuth':
          return history.push('/settings/url-auth');
      }
    })().catch(console.error);
  }, [history, isPopup]);

  return (
    <Header {...rest}>
      <Flex
        alignItems='center'
        flexDirection='row'
        justifyContent='space-between'
        mb='m'
      >
        <NetworkSelector />
        <Flex
          flexDirection='row'
          justifyContent='center'
        >
          <GrowingButton
            icon={SvgViewDashboard}
            onClick={openDashboard}
          />
          <OptionSelector
            className='settings-menu'
            minWidth='368px'
            onSelect={handleTopMenuSelection}
            options={topMenuOptions}
            position='bottom-right'
            selector={
              <Icon
                Asset={SvgDotsVertical}
                color='polyIndigo'
                height={32}
                style={{ cursor: 'pointer' }}
                width={32}
              />
            }
          />
        </Flex>
      </Flex>
      {children}
    </Header>
  );
};

export default AppHeader;
