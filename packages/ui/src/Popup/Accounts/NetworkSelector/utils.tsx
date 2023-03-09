import React from 'react';
import {
  networkLabels,
  networkIsDev,
} from '@polymeshassociation/extension-core/constants';
import mainnetCircleSvg from '@polymeshassociation/extension-ui/assets/mainnet-circle.svg';
import { NetworkName } from '@polymeshassociation/extension-core/types';
import { SvgCheck } from '@polymeshassociation/extension-ui/assets/images/icons';
import { colors } from '@polymeshassociation/extension-ui/components/themeDefinitions';
import { Flex, Box, Icon, Text } from '@polymeshassociation/extension-ui/ui';
import { NetworkCircle } from './styles';

type NetworkItem = {
  network: NetworkName;
  label: string;
};

type NetworkGroups = {
  prodNetworks: NetworkItem[];
  devNetworks: NetworkItem[];
};

type NetworkColors = {
  image?: string;
  backgrounds: string[];
  foreground: string;
};

export const NETWORK_COLORS: Record<NetworkName, NetworkColors> = {
  mainnet: {
    image: mainnetCircleSvg,
    backgrounds: ['#FAD1DC', '#EC467340'],
    foreground: '#43195B',
  },
  testnet: {
    backgrounds: ['#DCEFFE', '#1348E440'],
    foreground: '#1348E4',
  },
  staging: {
    backgrounds: ['#D7F4F2', '#60D3CB40'],
    foreground: '#60D3CB',
  },
  local: {
    backgrounds: ['#D7F4F2', '#60D3CB40'],
    foreground: '#60D3CB',
  },
};

// Separate production and development networks from `networkLabels` as `NetworkItem` arrays
export const networkGroups: NetworkGroups = Object.entries(
  networkLabels
).reduce(
  ({ prodNetworks, devNetworks }: NetworkGroups, networkLabel) => {
    const [network, label] = networkLabel as [NetworkName, string];
    const isDevNetwork = networkIsDev[network];

    if (isDevNetwork) devNetworks.push({ network, label });
    else prodNetworks.push({ network, label });

    return { prodNetworks, devNetworks };
  },
  { prodNetworks: [], devNetworks: [] }
);

export function makeNetworkMenu(
  networks: NetworkItem[],
  currentNetwork: string
) {
  return networks.map(({ network, label }) => {
    const isCurrentNetwork = currentNetwork === network;

    return {
      label: (
        <Flex
          className="network-item"
          key={network}
          px="16px"
          py="8px"
          {...(isCurrentNetwork && { style: { background: colors.gray[5] } })}
        >
          <NetworkCircle
            background={NETWORK_COLORS[network].backgrounds[0]}
            color={NETWORK_COLORS[network].foreground}
            image={NETWORK_COLORS[network].image}
            size="24px"
            thickness="4px"
          />
          <Box ml="8px" mr="auto">
            <Text variant="b2m">{label}</Text>
          </Box>

          {isCurrentNetwork && (
            <Box ml="auto">
              <Icon Asset={SvgCheck} color="brandMain" height={24} width={24} />
            </Box>
          )}
        </Flex>
      ),
      value: network,
    };
  });
}
