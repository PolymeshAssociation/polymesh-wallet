import { networkLabels } from '@polymathnetwork/extension-core/constants';
import { NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgChevron } from '@polymathnetwork/extension-ui/assets/images/icons';
import { styled } from '@polymathnetwork/extension-ui/styles';
import { Box, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

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
    bg: 'lightgray',
    fg: 'darkgray'
  },
  pme: {
    bg: 'lightgray',
    fg: 'darkgray'
  },
  local: {
    bg: 'lightgray',
    fg: 'darkgray'
  }
};

export function NetworkSelector ({ network }: NetworkSelectorProps): React.ReactElement {
  const bg = networkColors[network].bg;
  const fg = networkColors[network].fg;
  const bg2 = `${fg}40`; // background color with 0.25 opacity, using 8 digit hex code

  return (
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
  );
}

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
