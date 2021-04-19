import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { BoxProps } from '../ui/Box';

type OptionLabel = string | JSX.Element;

export type Option = {
  label: OptionLabel;
  value: any;
};

export type CategoryOptions = {
  category: string;
  options: Option[];
};

type OptionSelectorProps = BoxProps &
PropsWithChildren<{
  options: Option[] | CategoryOptions[];
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

  const hasCategories = 'category' in options[0];

  return (
    <Box onClick={showOptions}
      ref={wrapperRef}>
      {children}

      {isShowingOptions &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            coords={coords}
            ref={optionsRef}
            style={style}>
            {hasCategories &&
              (options as CategoryOptions[]).map((option: CategoryOptions, index: number) => {
                return (
                  <Fragment key={index}>
                    <Box mx='16px'>
                      <Text color='gray.2'
                        variant='b2m'>
                        {option.category}
                      </Text>
                    </Box>
                    <ul>
                      {option.options.map((_option, _index) => (
                        <li key={_index}
                          onClick={() => onSelect(_option.value)}>
                          {renderOptionLabel(_option.label)}
                        </li>
                      ))}
                    </ul>
                  </Fragment>
                );
              })}
          </Options>,
          portalRoot
        )}
    </Box>
  );
}

function renderOptionLabel (label: OptionLabel) {
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
}

const Options = styled(Box)<{ coords: { x: number; y: number } }>`
  position: absolute;
  top: ${(props) => props.coords.y}px;
  left: ${(props) => props.coords.x}px;
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
