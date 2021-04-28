import { networkIsDev, networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgCheck, SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import { OptionSelector, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector/types';
import { colors } from '@polymathnetwork/extension-ui/components/themeDefinitions';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useContext } from 'react';

const DEV_NETWORK_COLORS = {
  backgrounds: ['#DCEFFE', '#1348E440'],
  foreground: '#1348E4'
};

const NETWORK_COLORS: Record<NetworkName, { backgrounds: string[]; foreground: string }> = {
  itn: {
    backgrounds: ['#F2E6FF', '#4D019840'],
    foreground: '#4D0198'
  },
  alcyone: {
    backgrounds: ['#FBF3D0', '#E3A30C40'],
    foreground: '#E3A30C'
  },
  pmf: DEV_NETWORK_COLORS,
  pme: DEV_NETWORK_COLORS,
  local: DEV_NETWORK_COLORS
};

type NetworkSelectorProps = {
  onSelect: (network: NetworkName) => void;
};

export function NetworkSelector ({ onSelect }: NetworkSelectorProps): React.ReactElement {
  const { networkState: { isDeveloper, selected: currentNetwork } } = useContext(PolymeshContext);

  const [background, backgroundLight] = NETWORK_COLORS[currentNetwork].backgrounds;
  const foreground = NETWORK_COLORS[currentNetwork].foreground;

  const { devNetworks, networks } = Object.entries(networkLabels).reduce(
    ({ devNetworks, networks }: Record<string, string[][]>, networkLabel) => {
      const [network, label] = networkLabel;

      networkIsDev[network as NetworkName] ? devNetworks.push([network, label]) : networks.push([network, label]);

      return { networks, devNetworks };
    },
    { networks: [], devNetworks: [] }
  );

  const networkMenuItems = (networks: string[][]) =>
    networks.map(([network, networkLabel]) => {
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
              background={NETWORK_COLORS[network as NetworkName].backgrounds[0]}
              color={NETWORK_COLORS[network as NetworkName].foreground}
              size='24px'
              thickness='4px'
            />
            <Box ml='8px'
              mr='auto'>
              <Text variant='b2m'>{networkLabel}</Text>
            </Box>

            {isCurrentNetwork && (
              <Box ml='auto'>
                <Icon Asset={SvgCheck}
                  color='brandMain'
                  height={24}
                  width={24} />
              </Box>
            )}
          </Flex>
        ),
        value: network
      };
    });

  const networkOptions: Option[] = [
    {
      category: 'Networks',
      menu: networkMenuItems(networks)
    }
  ];

  if (isDeveloper) {
    networkOptions.push({
      category: 'Development',
      menu: networkMenuItems(devNetworks)
    });
  }

  return (
    <OptionSelector
      minWidth='296px'
      onSelect={onSelect}
      options={networkOptions}
      position='bottom-left'
      selector={
        <NetworkSelect background={background}>
          <NetworkCircle background={background}
            color={foreground} />
          <Box ml='4px'
            mr='7px'>
            <Text color={foreground}
              variant='b3m'>
              {networkLabels[currentNetwork]}
            </Text>
          </Box>
          <DropdownIcon background={backgroundLight}>
            <Icon Asset={SvgChevron}
              color={foreground}
              rotate='180deg' />
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

const NetworkCircle = styled.span<{ background: string; color: string; size?: string; thickness?: string }>`
  display: inline-box;
  width: ${(props) => props.size || '12px'};
  height: ${(props) => props.size || '12px'};
  background: ${(props) => props.background};
  box-sizing: border-box;
  border: ${(props) => props.thickness || '2px'} solid ${(props) => props.color};
  border-radius: 50%;
  flex-shrink: 0;
`;
