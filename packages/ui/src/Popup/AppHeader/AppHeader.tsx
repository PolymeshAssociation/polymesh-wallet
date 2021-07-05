import { networkLinks } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { AccountContext, OptionSelector, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector/types';
import useIsPopup from '@polymathnetwork/extension-ui/hooks/useIsPopup';
import { setPolyNetwork, togglePolyIsDev, windowOpen } from '@polymathnetwork/extension-ui/messaging';
import { GrowingButton } from '@polymathnetwork/extension-ui/ui';
import { Header, HeaderProps } from '@polymathnetwork/extension-ui/ui/Header/Header';
import { Box, Checkbox, Flex, Icon, icons, Text } from '@polymathnetwork/polymesh-ui';
import React, { ReactElement, useCallback, useContext } from 'react';
import { useHistory } from 'react-router';

import { NetworkSelector } from '../Accounts/NetworkSelector';

export type Props = HeaderProps;

const AppHeader = (props: Props): ReactElement<Props> => {
  const { accounts } = useContext(AccountContext);
  const { children, ...rest } = props;
  const hasNonHardwareAccount = accounts.some((account) => !account.isHardware);
  const { networkState: { isDeveloper, selected: selectedNetwork } } = useContext(PolymeshContext);
  const history = useHistory();
  const isPopup = useIsPopup();

  const setNetwork = async (_network: NetworkName) => {
    if (_network !== selectedNetwork) {
      await setPolyNetwork(_network);
    }
  };

  const openDashboard = useCallback(() => {
    chrome.tabs.create({ url: networkLinks[selectedNetwork].dashboard });
  }, [selectedNetwork]);

  const topMenuOptions: Option[] = [
    {
      menu: [
        ...(hasNonHardwareAccount ? [{ label: 'Change password', value: 'changePassword' }] : []),
        { label: 'Open extension in a new tab', value: 'newWindow' },
        { label: 'Manage connected dApps', value: 'manageUrlAuth' },
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
  };

  return (
    <Header {...rest }>
      <Flex alignItems='center'
        flexDirection='row'
        justifyContent='space-between'
        mb='m'>
        <NetworkSelector onSelect={setNetwork} />
        <Flex flexDirection='row'
          justifyContent='center'>
          <GrowingButton icon={icons.SvgViewDashboard}
            onClick={openDashboard} />
          <OptionSelector
            className='settings-menu'
            onSelect={handleTopMenuSelection}
            options={topMenuOptions}
            position='bottom-right'
            selector={
              <Icon Asset={icons.SvgDotsVertical}
                color='gray.0'
                height={24}
                style={{ cursor: 'pointer' }}
                width={24} />
            }
          />
        </Flex>
      </Flex>
      {children}
    </Header>
  );
};

export default AppHeader;
