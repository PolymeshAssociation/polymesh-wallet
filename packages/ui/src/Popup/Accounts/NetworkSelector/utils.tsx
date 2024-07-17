import type { MouseEvent } from 'react';

import React from 'react';

import { networkIsDev, networkLabels } from '@polymeshassociation/extension-core/constants';
import { NetworkName } from '@polymeshassociation/extension-core/types';
import { SvgCheck, SvgPencilOutline } from '@polymeshassociation/extension-ui/assets/images/icons';
import mainnetCircleSvg from '@polymeshassociation/extension-ui/assets/mainnet-circle.svg';
import { colors } from '@polymeshassociation/extension-ui/components/themeDefinitions';
import { Box, Flex, Icon, Text } from '@polymeshassociation/extension-ui/ui';

import { NetworkCircle } from './styles';

interface NetworkItem {
  network: NetworkName;
  label: string;
}

interface NetworkGroups {
  prodNetworks: NetworkItem[];
  devNetworks: NetworkItem[];
}

interface NetworkColors {
  image?: string;
  backgrounds: string[];
  foreground: string;
}

export const NETWORK_COLORS: Record<NetworkName, NetworkColors> = {
  custom: {
    backgrounds: ['#FAD1DC', '#EC467340'],
    foreground: '#43195B'
  },
  local: {
    backgrounds: ['#D7F4F2', '#60D3CB40'],
    foreground: '#60D3CB'
  },
  mainnet: {
    backgrounds: ['#FAD1DC', '#EC467340'],
    foreground: '#43195B',
    image: mainnetCircleSvg
  },
  staging: {
    backgrounds: ['#D7F4F2', '#60D3CB40'],
    foreground: '#60D3CB'
  },
  testnet: {
    backgrounds: ['#DCEFFE', '#1348E440'],
    foreground: '#1348E4'
  }
};

// Separate production and development networks from `networkLabels` as `NetworkItem` arrays
export const networkGroups: NetworkGroups = Object.entries(
  networkLabels
).reduce(
  ({ devNetworks, prodNetworks }: NetworkGroups, networkLabel) => {
    const [network, label] = networkLabel as [NetworkName, string];
    const isDevNetwork = networkIsDev[network];

    if (isDevNetwork) {
      devNetworks.push({ label, network });
    } else {
      prodNetworks.push({ label, network });
    }

    return { devNetworks, prodNetworks };
  },
  { devNetworks: [], prodNetworks: [] }
);

export function makeNetworkMenu (
  networks: NetworkItem[],
  currentNetwork: NetworkName,
  toggleEditMode?: (e: MouseEvent<HTMLDivElement>) => void
) {
  return networks.map(({ label, network }) => {
    const isCurrentNetwork = currentNetwork === network;

    return {
      label: (
        <Flex
          className='network-item'
          key={network}
          px='16px'
          py='8px'
          {...(isCurrentNetwork && { style: { background: colors.gray[5] } })}
        >
          <NetworkCircle
            background={NETWORK_COLORS[network].backgrounds[0]}
            color={NETWORK_COLORS[network].foreground}
            image={NETWORK_COLORS[network].image}
            size='24px'
            thickness='4px'
          />
          <Box
            ml='8px'
            mr='auto'
          >
            <Text variant='b2m'>{label}</Text>
          </Box>
          {isCurrentNetwork && (
            <Flex>
              {network === NetworkName.custom && (
                <Box mr='4px'>
                  <Icon
                    Asset={SvgPencilOutline}
                    color={'gray.2'}
                    height={16}
                    onClick={toggleEditMode}
                    style={{ cursor: 'pointer' }}
                    width={16}
                  />
                </Box>
              )}
              <Box ml='auto'>
                <Icon
                  Asset={SvgCheck}
                  color='brandMain'
                  height={24}
                  width={24}
                />
              </Box>
            </Flex>
          )}
        </Flex>
      ),
      value: network
    };
  });
}
