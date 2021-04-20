import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { BoxProps } from '../ui/Box';

type OptionLabel = string | JSX.Element;

type OptionItem = {
  label: OptionLabel;
  value: any;
};

export type Option = {
  category?: string;
  options: OptionItem[];
};

type OptionSelectorProps = BoxProps &
{
  options: Option[];
  selector: string | JSX.Element;
  onSelect: (value: any) => void;
  style?: CSSProperties;
};

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, selector, style, ...boxProps } = props;

  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const portalRoot = document.getElementById(OPTION_SELECTOR_PORTAL_ID);

  const insertPortalRoot = () => {
    const root = document.getElementById('root');
    const createdPortalRoot = document.createElement('div');

    createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
    root?.parentNode?.insertBefore(createdPortalRoot, root.nextSibling);
  };

  const positionOptionsEl = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) return;

    // @TODO add options, or calculate where to render the options: bottom-left, bottom-right, top-left, top-right, etc.
    // Default: bottom-left
    setCoords({
      x: rect.x,
      y: rect.y + rect.height + SELECTOR_SPACING
    });
  };

  const showOptions = () => {
    insertPortalRoot();
    positionOptionsEl();
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
      portalRoot?.remove();
    };
  }, [isShowingOptions, portalRoot]);

  return (
    <Box onClick={showOptions}
      ref={wrapperRef}>
      {selector}

      {isShowingOptions && !!portalRoot &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            coords={coords}
            ref={optionsRef}
            style={style}>
            {options.map((option, index) => (
              <Fragment key={index}>
                {option.category && (
                  <Box mx='16px'
                    textAlign='left'>
                    <Text color='gray.2'
                      variant='b2m'>
                      {option.category}
                    </Text>
                  </Box>
                )}
                <ul>
                  {option.options.map((_option, _index) => (
                    <li key={_index}
                      onClick={() => onSelect(_option.value)}>
                      {renderOptionLabel(_option.label)}
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
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
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';
