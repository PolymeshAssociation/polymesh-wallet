import React, { useContext } from 'react';
import {
  networkIsDev,
  networkLabels,
} from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import mainnetCircleSvg from '@polymathnetwork/extension-ui/assets/mainnet-circle.svg';
import {
  SvgCheck,
  SvgChevron,
} from '@polymathnetwork/extension-ui/assets/images/icons';
import {
  OptionSelector,
  PolymeshContext,
} from '@polymathnetwork/extension-ui/components';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector/types';
import { colors } from '@polymathnetwork/extension-ui/components/themeDefinitions';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';

const { devNetworks, networks } = Object.entries(networkLabels).reduce(
  ({ devNetworks, networks }: Record<string, string[][]>, networkLabel) => {
    const [network, label] = networkLabel;

    networkIsDev[network as NetworkName]
      ? devNetworks.push([network, label])
      : networks.push([network, label]);

    return {
      networks,
      devNetworks,
    };
  },
  {
    networks: [],
    devNetworks: [],
  }
);

const DEV_NETWORK_COLORS = {
  backgrounds: ['#D7F4F2', '#60D3CB40'],
  foreground: '#60D3CB',
};

type NetworkColors = {
  image?: string;
  backgrounds: string[];
  foreground: string;
};

const NETWORK_COLORS: Record<string, NetworkColors> = {
  mainnet: {
    image: mainnetCircleSvg,
    backgrounds: ['#FAD1DC', '#EC467340'],
    foreground: '#43195B',
  },
  testnet: {
    backgrounds: ['#DCEFFE', '#1348E440'],
    foreground: '#1348E4',
  },
  pmf: DEV_NETWORK_COLORS,
  pme: DEV_NETWORK_COLORS,
  local: DEV_NETWORK_COLORS,
};

const getNetworkItems = (networks: string[][], currentNetwork: string) =>
  networks.map(([network, networkLabel]) => {
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
            <Text variant="b2m">{networkLabel}</Text>
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

type NetworkSelectorProps = {
  onSelect: (network: NetworkName) => void;
};

export function NetworkSelector({
  onSelect,
}: NetworkSelectorProps): React.ReactElement {
  const {
    networkState: { isDeveloper, selected: currentNetwork },
  } = useContext(PolymeshContext);

  const [background, backgroundLight] =
    NETWORK_COLORS[currentNetwork]?.backgrounds ||
    NETWORK_COLORS.testnet.backgrounds;
  const foreground =
    NETWORK_COLORS[currentNetwork]?.foreground ||
    NETWORK_COLORS.testnet.foreground;

  const networkOptions: Option[] = [
    {
      category: 'Networks',
      menu: getNetworkItems(networks, currentNetwork),
    },
    ...(isDeveloper
      ? [
          {
            category: 'Development',
            menu: getNetworkItems(devNetworks, currentNetwork),
          },
        ]
      : []),
  ];

  return (
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
  );
}

const NetworkSelect = styled.div<{ background: string }>`
  display: flex;
  align-items: center;
  height: 24px;
  border-radius: 24px;
  padding: 0 3px 0 8px;
  background: ${(props) => props.background};
  cursor: pointer;
`;

const DropdownIcon = styled.div<{ background: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => props.background};
`;

const NetworkCircle = styled.span<{
  background: string;
  color: string;
  image?: string;
  size?: string;
  thickness?: string;
}>`
  display: inline-box;
  width: ${(props) => props.size || '12px'};
  height: ${(props) => props.size || '12px'};
  background: ${(props) =>
    props.image ? `url(${props.image})` : props.background};
  border: ${(props) => (props.image ? 'none' : props.thickness || '2px')} solid
    ${(props) => props.color};
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 50%;
  flex-shrink: 0;
`;
