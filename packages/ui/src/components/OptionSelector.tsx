import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { BoxProps } from '../ui/Box';

type OptionLabel = string | JSX.Element;

export type Option = {
  label: OptionLabel;
  value: any;
};

type OptionSelectorProps = BoxProps & PropsWithChildren<{
  options: Option[];
  style?: CSSProperties;
}>;

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { children, options, style, ...boxProps } = props;

  const renderOption = (label: OptionLabel) => {
    return typeof label === 'string'
      ? (
        <Flex className='network-item'
          px='16px'
          py='8px'>
          <Text variant='b2m'>
            {label}
          </Text>
        </Flex>
      )
      : label;
  };

  return (
    <Wrapper>
      {children}
      <Options {...boxProps}
        style={style}>
        <ul>
          {options.map((option, index) => (
            <li key={index}>
              {renderOption(option.label)}
            </li>
          ))}
        </ul>
      </Options>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Options = styled(Box)`
  position: absolute;
  background: white;
  box-shadow: ${(props) => props.theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: ${(props) => props.theme.colors.gray[5]};
      }
    }
  }
`;
