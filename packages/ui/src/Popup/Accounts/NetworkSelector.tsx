import { networkIsDev, networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import { PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { setPolyNetwork } from '@polymathnetwork/extension-ui/messaging';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Icon, Text } from '@polymathnetwork/extension-ui/ui';
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
    bg: '#EBF0F7',
    fg: '#8C9BA5'
  },
  pme: {
    bg: '#EBF0F7',
    fg: '#8C9BA5'
  },
  local: {
    bg: '#EBF0F7',
    fg: '#8C9BA5'
  }
};

export function NetworkSelector ({ network }: NetworkSelectorProps): React.ReactElement {
  const { networkState: { isDeveloper } } = useContext(PolymeshContext);

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
        <NetworkCircle color={fg} />

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
        width='296px'>
        <Box mx='16px'
          my='8px'>
          <Text color='gray.2'
            variant='b2m'>
              Networks
          </Text>
        </Box>
        {Object.entries(networkLabels)
          .filter(([_network]) => isDeveloper || (!isDeveloper && !networkIsDev[_network as NetworkName]))
          .map(([_network, networkLabel]) => {
            return (
              <Box className='network-item'
                key={_network}
                onClick={() => changeNetwork(_network as NetworkName)}
                px='16px'
                py='8px'>
                <Text variant='b2m'>
                  {networkLabel}
                </Text>
              </Box>
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

const NetworkCircle = styled.div<{ color: string; }>`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid ${(props) => props.color};
  border-radius: 50%;
`;

const NetworkDropdown = styled(Box)`
  position: absolute;
  background: white;
  box-shadow: ${(props) => props.theme.shadows[1]};
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
