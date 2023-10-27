import React, { useContext, useEffect, useState, MouseEvent } from 'react';
import { networkLabels } from '@polymeshassociation/extension-core/constants';
import { NetworkName } from '@polymeshassociation/extension-core/types';
import {
  setPolyCustomRpc,
  setPolyNetwork,
} from '@polymeshassociation/extension-ui/messaging';
import { SvgChevron } from '@polymeshassociation/extension-ui/assets/images/icons';
import {
  OptionSelector,
  PolymeshContext,
} from '@polymeshassociation/extension-ui/components';
import { Option } from '@polymeshassociation/extension-ui/components/OptionSelector/types';
import { Box, Icon, Text } from '@polymeshassociation/extension-ui/ui';
import { makeNetworkMenu, networkGroups, NETWORK_COLORS } from './utils';
import { NetworkEdit } from './NetworkEdit';
import { NetworkSelect, NetworkCircle, DropdownIcon } from './styles';


export function NetworkSelector() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { networkState } = useContext(PolymeshContext);

  const {
    isDeveloper,
    selected: currentNetwork,
    customNetworkUrl: currentCustomNetworkUrl
  } = networkState;

  const setNetwork = async (_network: NetworkName) => {
    if (_network !== currentNetwork) {
      await setPolyNetwork(_network);
    };
  };

  const handleSelectNetwork = (network: NetworkName) => {
    if (network === 'custom' && !currentCustomNetworkUrl) {
      return setIsEditMode(true);
    };
    setNetwork(network);
  };

  const handleCustomRpcChange = async (customNetworkUrl: string) => {
    if (customNetworkUrl === currentCustomNetworkUrl) {
      setIsEditMode(false);
      return;
    }

    await setPolyCustomRpc(customNetworkUrl);
    setNetwork(NetworkName.custom);

    setIsEditMode(false);
  }

  const toggleEditMode = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setIsEditMode(prev => !prev);
  };

  const networkOptions: Option[] = [
    {
      category: 'Networks',
      menu: makeNetworkMenu(networkGroups.prodNetworks, currentNetwork),
    },
    ...(isDeveloper
      ? [
        {
          category: 'Development',
          menu: makeNetworkMenu(networkGroups.devNetworks, currentNetwork, toggleEditMode),
          submenu: isEditMode
            ? <NetworkEdit defaultValue={currentCustomNetworkUrl} setUrlValue={handleCustomRpcChange} />
            : null,
        },
      ]
      : []),
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
    if (!networkLabels[currentNetwork]) setNetwork(NetworkName.mainnet);
  }, [currentNetwork]);


  return networkLabels[currentNetwork] ? (
    <OptionSelector
      minWidth="368px"
      onSelect={handleSelectNetwork}
      options={networkOptions}
      position="bottom-left"
      selector={
        <NetworkSelect background={background} id="network-selector">
          <NetworkCircle
            background={background}
            color={foreground}
            image={NETWORK_COLORS[currentNetwork].image}
          />
          <Box ml="4px" mr="7px">
            <Text color={foreground} variant="b3m">
              {networkLabels[currentNetwork]}
            </Text>
          </Box>
          <DropdownIcon background={backgroundLight}>
            <Icon Asset={SvgChevron} color={foreground} rotate="180deg" />
          </DropdownIcon>
        </NetworkSelect>
      }
    />
  ) : null;
}
