import { networkIsDev, networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgCheck, SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import { OptionSelector, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { Option } from '@polymathnetwork/extension-ui/components/OptionSelector';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Flex, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React, { useContext, useEffect, useRef, useState } from 'react';

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
  currentNetwork: NetworkName;
  onSelect: (network: NetworkName) => void;
};

export function NetworkSelector ({ currentNetwork, onSelect }: NetworkSelectorProps): React.ReactElement {
  const { networkState: { isDeveloper, selected } } = useContext(PolymeshContext);

  const [isDropdownShowing, setIsDropdownShowing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [background, backgroundLight] = NETWORK_COLORS[currentNetwork].backgrounds;
  const foreground = NETWORK_COLORS[currentNetwork].foreground;

  const showDropdown = () => {
    setIsDropdownShowing(true);
  };

  const handleClick = (event: MouseEvent) => {
    const hasClickedOutside = !dropdownRef.current?.contains(event.target as Node);

    if (hasClickedOutside) {
      setIsDropdownShowing(false);
    }
  };

  // Toggle click listener to hide dropdown, when clicked outside of dropdown
  useEffect(() => {
    if (isDropdownShowing) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isDropdownShowing]);

  const networkOptions: Option[] = [
    {
      category: 'Networks',
      options: Object.entries(networkLabels)
        .filter(([_network]) => isDeveloper || (!isDeveloper && !networkIsDev[_network as NetworkName]))
        .map(([_network, networkLabel]) => {
          return {
            label: (
              <Flex
                className='network-item'
                key={_network}
                // onClick={() => onSelect(_network as NetworkName)}
                px='16px'
                py='8px'
              >
                <NetworkCircle
                  background={NETWORK_COLORS[_network as NetworkName].backgrounds[0]}
                  color={NETWORK_COLORS[_network as NetworkName].foreground}
                  size='24px'
                  thickness='4px'
                />
                <Box ml='8px'
                  mr='auto'>
                  <Text variant='b2m'>{networkLabel}</Text>
                </Box>

                {selected === _network && (
                  <Box ml='auto'>
                    <Icon Asset={SvgCheck}
                      color='brandMain'
                      height={24}
                      width={24} />
                  </Box>
                )}
              </Flex>
            ),
            value: _network
          };
        })
    }
  ];

  const changeNetwork = (network: NetworkName) => {
    console.log({ network });
  };

  return (
    <OptionSelector
      minWidth='296px'
      onSelect={changeNetwork}
      options={networkOptions}
      selector={
        <NetworkSelect background={background}
          onClick={showDropdown}>
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
    ></OptionSelector>
  );

  // return (
  // <Wrapper>
  // <NetworkSelect background={background}
  //   onClick={showDropdown}>
  //   <NetworkCircle background={background}
  //     color={foreground} />
  //   <Box ml='4px'
  //     mr='7px'>
  //     <Text color={foreground}
  //       variant='b3m'>
  //       {networkLabels[currentNetwork]}
  //     </Text>
  //   </Box>
  //   <DropdownIcon background={backgroundLight}>
  //     <Icon Asset={SvgChevron}
  //       color={foreground}
  //       rotate='180deg' />
  //   </DropdownIcon>
  // </NetworkSelect>
  //   {isDropdownShowing &&
  //     <NetworkDropdown borderRadius='8px'
  //       py='8px'
  //       ref={dropdownRef}
  //       width='296px'>
  //       <Box mx='16px'>
  //         <Text color='gray.2'
  //           variant='b2m'>
  //             Networks
  //         </Text>
  //       </Box>
  //       {Object.entries(networkLabels)
  //         .filter(([_network]) => isDeveloper || (!isDeveloper && !networkIsDev[_network as NetworkName]))
  //         .map(([_network, networkLabel]) => {
  //           return (
  //             <Flex className='network-item'
  //               key={_network}
  //               onClick={() => onSelect(_network as NetworkName)}
  //               px='16px'
  //               py='8px'>
  //               <NetworkCircle background={NETWORK_COLORS[_network as NetworkName].backgrounds[0]}
  //                 color={NETWORK_COLORS[_network as NetworkName].foreground}
  //                 size='24px'
  //                 thickness='4px'/>
  //               <Box ml='8px'
  //                 mr='auto'>
  //                 <Text variant='b2m'>
  //                   {networkLabel}
  //                 </Text>
  //               </Box>
  //               {selected === _network &&
  //                 <Icon
  //                   Asset={SvgCheck}
  //                   color='brandMain'
  //                   height={24}
  //                   width={24}
  //                 />
  //               }
  //             </Flex>
  //           );
  //         })}
  //     </NetworkDropdown>
  //   }
  // </Wrapper>
  // );
}

const Wrapper = styled.div`
  position: relative;
`;

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
