import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { BoxProps } from '../ui/Box';

type OptionLabel = string | JSX.Element;

export type Option = {
  label: OptionLabel;
  value: any;
};

type OptionSelectorProps = BoxProps &
PropsWithChildren<{
  options: Option[];
  onSelect: (value: any) => void;
  style?: CSSProperties;
}>;

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { children, onSelect, options, style, ...boxProps } = props;

  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const portalRoot = document.createElement('div');

  const showOptions = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) return;

    // @TODO add options, or calculate where to render the options: bottom-left, bottom-right, top-left, top-right, etc.
    // Default: bottom-left
    setCoords({
      x: rect.x,
      y: rect.y + rect.height + SELECTOR_SPACING
    });
    setIsShowingOptions(true);
  };

  const renderOption = (label: OptionLabel) => {
    return typeof label === 'string'
      ? (
        <Flex className='network-item'
          px='16px'
          py='8px'>
          <Text variant='b2m'>{label}</Text>
        </Flex>
      )
      : (
        label
      );
  };

  const handleClick = (event: MouseEvent) => {
    const hasClickedOutside = !optionsRef.current?.contains(event.target as Node);

    if (hasClickedOutside) {
      setIsShowingOptions(false);
    }
  };

  useEffect(() => {
    if (isShowingOptions) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isShowingOptions]);

  // Add root element for portal
  useEffect(() => {
    const root = document.getElementById('root');

    portalRoot.id = 'option-selector-root';

    root?.appendChild(portalRoot);

    return () => {
      portalRoot.remove();
    };
  }, [portalRoot]);

  return (
    <Box onClick={showOptions}
      ref={wrapperRef}>
      {children}

      {isShowingOptions &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            ref={optionsRef}
            style={style}
            x={coords.x}
            y={coords.y}>
            <ul>
              {options.map((option, index) => (
                <li key={index}
                  onClick={() => onSelect(option.value)}>
                  {renderOption(option.label)}
                </li>
              ))}
            </ul>
          </Options>,
          portalRoot
        )}
    </Box>
  );
}

const Options = styled(Box)<{ x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  background: white;
  box-shadow: ${(props) => props.theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;

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

const SELECTOR_SPACING = 4;
