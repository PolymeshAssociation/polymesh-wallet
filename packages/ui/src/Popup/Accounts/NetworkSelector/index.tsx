import React, { useContext, useEffect } from 'react';
import { networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import {
  OptionSelector,
  PolymeshContext,
} from '@polymathnetwork/extension-ui/components';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector/types';
import { Box, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import { makeNetworkMenu, networkGroups, NETWORK_COLORS } from './utils';
import { NetworkSelect, NetworkCircle, DropdownIcon } from './styles';

type NetworkSelectorProps = {
  onSelect: (network: NetworkName) => void;
};

export function NetworkSelector({ onSelect }: NetworkSelectorProps) {
  const { networkState } = useContext(PolymeshContext);

  const { isDeveloper, selected: currentNetwork } = networkState;
  const networkOptions: Option[] = [
    {
      category: 'Networks',
      menu: makeNetworkMenu(networkGroups.prodNetworks, currentNetwork),
    },
    ...(isDeveloper
      ? [
          {
            category: 'Development',
            menu: makeNetworkMenu(networkGroups.devNetworks, currentNetwork),
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
    if (!networkLabels[currentNetwork]) onSelect(NetworkName.mainnet);
  }, [currentNetwork]);

  return networkLabels[currentNetwork] ? (
    <OptionSelector
      minWidth="368px"
      onSelect={onSelect}
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
