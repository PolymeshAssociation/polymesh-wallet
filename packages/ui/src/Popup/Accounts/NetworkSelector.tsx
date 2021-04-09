import { networkIsDev, networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgCheck, SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import { PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { setPolyNetwork } from '@polymathnetwork/extension-ui/messaging';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useContext } from 'react';

type NetworkSelectorProps = {
  network: NetworkName;
}

const networkColors: Record<NetworkName, { bg: string, fg: string }> = {
  itn: {
    bg: '#F2E6FF',
    fg: '#4D0198'
  },
  alcyone: {
    bg: '#FBF3D0',
    fg: '#E3A30C'
  },
  pmf: {
    bg: '#DCEFFE',
    fg: '#1348E4'
  },
  pme: {
    bg: '#DCEFFE',
    fg: '#1348E4'
  },
  local: {
    bg: '#DCEFFE',
    fg: '#1348E4'
  }
};

export function NetworkSelector ({ network }: NetworkSelectorProps): React.ReactElement {
  const { networkState: { isDeveloper, selected } } = useContext(PolymeshContext);

  const bg = networkColors[network].bg;
  const fg = networkColors[network].fg;
  const bg2 = `${fg}40`; // background color with 0.25 opacity, using 8 digit hex code

  const changeNetwork = async (networkKey: NetworkName) => {
    if (!!networkKey && networkKey !== network) {
      await setPolyNetwork(networkKey);
    }
  };

  return (
    <Wrapper>
      <NetworkSelect bg={bg}>
        <NetworkCircle bg={bg}
          color={fg} />
        <Box ml='4px'
          mr='7px'>
          <Text color={fg}
            variant='b3m'>
            {networkLabels[network]}
          </Text>
        </Box>
        <DropdownIcon bg={bg2}>
          <Icon Asset={SvgChevron}
            color={fg}
            rotate='180deg' />
        </DropdownIcon>
      </NetworkSelect>

      <NetworkDropdown borderRadius='8px'
        py='8px'
        width='296px'>
        <Box mx='16px'>
          <Text color='gray.2'
            variant='b2m'>
              Networks
          </Text>
        </Box>
        {Object.entries(networkLabels)
          .filter(([_network]) => isDeveloper || (!isDeveloper && !networkIsDev[_network as NetworkName]))
          .map(([_network, networkLabel]) => {
            return (
              <Flex className='network-item'
                key={_network}
                onClick={() => changeNetwork(_network as NetworkName)}
                px='16px'
                py='8px'>
                <NetworkCircle bg={networkColors[_network as NetworkName].bg}
                  color={networkColors[_network as NetworkName].fg}
                  size='24px'
                  thickness='4px'/>
                <Box ml='8px'
                  mr='auto'>
                  <Text variant='b2m'>
                    {networkLabel}
                  </Text>
                </Box>
                {selected === _network &&
                  <Icon
                    Asset={SvgCheck}
                    color='brandMain'
                    height={24}
                    width={24}
                  />
                }
              </Flex>
            );
          })}
      </NetworkDropdown>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const NetworkSelect = styled.div<{ bg: string; }>`
  display: flex;
  align-items: center;
  height: 24px;
  border-radius: 24px;
  padding: 0 3px 0 6px;
  background: ${(props) => props.bg};
  cursor: pointer;
`;

const DropdownIcon = styled.div<{ bg: string; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => props.bg};
`;

const NetworkCircle = styled.span<{ bg: string; color: string; size?: string; thickness?: string; }>`
  display: inline-box;
  width: ${(props) => props.size || '12px'};
  height: ${(props) => props.size || '12px'};
  background: ${(props) => props.bg};
  box-sizing: border-box;
  border: ${(props) => props.thickness || '2px'} solid ${(props) => props.color};
  border-radius: 50%;
`;

const NetworkDropdown = styled(Box)`
  position: absolute;
  background: white;
  box-shadow: ${(props) => props.theme.shadows[3]};
  top: calc(100% + 4px);
  left: 0;
  z-index: 1;

  .network-item {
    cursor: pointer;

    &:hover {
      background: ${(props) => props.theme.colors.gray[5]};
    }
  }
`;
