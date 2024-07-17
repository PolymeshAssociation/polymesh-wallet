import type { MouseEvent } from 'react';
import type { Option } from '@polymeshassociation/extension-ui/components/OptionSelector/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { networkLabels } from '@polymeshassociation/extension-core/constants';
import { NetworkName } from '@polymeshassociation/extension-core/types';
import { SvgChevron } from '@polymeshassociation/extension-ui/assets/images/icons';
import { OptionSelector, PolymeshContext } from '@polymeshassociation/extension-ui/components';
import { setPolyCustomRpc, setPolyNetwork } from '@polymeshassociation/extension-ui/messaging';
import { Box, Icon, Text } from '@polymeshassociation/extension-ui/ui';

import { NetworkEdit } from './NetworkEdit';
import { DropdownIcon, NetworkCircle, NetworkSelect } from './styles';
import { makeNetworkMenu, NETWORK_COLORS, networkGroups } from './utils';

export function NetworkSelector () {
  const [isEditMode, setIsEditMode] = useState(false);
  const { networkState } = useContext(PolymeshContext);

  const { customNetworkUrl: currentCustomNetworkUrl,
    isDeveloper,
    selected: currentNetwork } = networkState;

  const setNetwork = useCallback(async (_network: NetworkName) => {
    if (_network !== currentNetwork) {
      await setPolyNetwork(_network);
    }
  }, [currentNetwork]);

  const handleSelectNetwork = useCallback((network: NetworkName) => {
    if (network === NetworkName.custom && !currentCustomNetworkUrl) {
      return setIsEditMode(true);
    }

    setNetwork(network).catch((err) => console.error('Error setting network: ', err));
  }, [currentCustomNetworkUrl, setNetwork]);

  const handleCustomRpcChange = useCallback((customNetworkUrl: string) => {
    if (customNetworkUrl === currentCustomNetworkUrl) {
      setIsEditMode(false);

      return;
    }

    (async () => {
      await setPolyCustomRpc(customNetworkUrl);
      await setNetwork(NetworkName.custom);
      setIsEditMode(false);
    })().catch((err) => console.error('Error setting custom network: ', err));
  }, [currentCustomNetworkUrl, setNetwork]);

  const toggleEditMode = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setIsEditMode((prev) => !prev);
  };

  const networkOptions: Option[] = [
    {
      category: 'Networks',
      menu: makeNetworkMenu(networkGroups.prodNetworks, currentNetwork)
    },
    ...(isDeveloper
      ? [
        {
          category: 'Development',
          menu: makeNetworkMenu(networkGroups.devNetworks, currentNetwork, toggleEditMode),
          submenu: isEditMode
            ? (
              <NetworkEdit
                defaultValue={currentCustomNetworkUrl}
                setUrlValue={handleCustomRpcChange}
              />
            )
            : null
        }
      ]
      : [])
  ];
  const [background, backgroundLight] =
    NETWORK_COLORS[currentNetwork]?.backgrounds ||
    NETWORK_COLORS.testnet.backgrounds;
  const foreground =
    NETWORK_COLORS[currentNetwork]?.foreground ||
    NETWORK_COLORS.testnet.foreground;

  // Automatically switch to 'Mainnet' network if current network doesn't exist.
  // This is necessary to prevent errors and UI bugs, as sometimes networks have to be modified, or removed.
  useEffect(() => {
    if (!networkLabels[currentNetwork]) {
      setNetwork(NetworkName.mainnet).catch((err) => console.error('Error setting network: ', err));
    }
  }, [currentNetwork, setNetwork]);

  return networkLabels[currentNetwork]
    ? (
      <OptionSelector
        minWidth='368px'
        onSelect={handleSelectNetwork}
        options={networkOptions}
        position='bottom-left'
        selector={
          <NetworkSelect
            background={background}
            id='network-selector'
          >
            <NetworkCircle
              background={background}
              color={foreground}
              image={NETWORK_COLORS[currentNetwork].image}
            />
            <Box
              ml='4px'
              mr='7px'
            >
              <Text
                color={foreground}
                variant='b3m'
              >
                {networkLabels[currentNetwork]}
              </Text>
            </Box>
            <DropdownIcon background={backgroundLight}>
              <Icon
                Asset={SvgChevron}
                color={foreground}
                rotate='180deg'
              />
            </DropdownIcon>
          </NetworkSelect>
        }
      />
    )
    : null;
}
