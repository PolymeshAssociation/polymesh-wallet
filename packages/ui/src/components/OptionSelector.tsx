/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { ThemeProps } from '../types';
import { BoxProps } from '../ui/Box';

const SELECTOR_SPACING = 4;
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';

type OptionLabel = string | JSX.Element;

type OptionItem = {
  label: OptionLabel;
  value: any;
};

export type Option = {
  category?: string;
  menu: OptionItem[];
};

type OptionSelectorProps = BoxProps & {
  options: Option[];
  selector: string | JSX.Element;
  onSelect: (value: any) => void;
  // @TODO add more positioning options as needed.
  // Or, add logic to dynamically calculate where to open like a context-menu (will make UI less predictable).
  position?: 'bottom-left' | 'bottom-right';
  style?: CSSProperties;
};

type CssPosition = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, position = 'bottom-left', selector, style, ...boxProps } = props;

  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [cssPosition, setCssPosition] = useState<CssPosition>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const portalRoot = document.getElementById(OPTION_SELECTOR_PORTAL_ID);

  const insertPortalRoot = () => {
    const root = document.getElementById('root');
    const createdPortalRoot = document.createElement('div');

    createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
    root?.appendChild(createdPortalRoot);
  };

  const cssPositionOptionsEl = () => {
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();

    if (!wrapperRect) return;

    switch (position) {
      case 'bottom-right':
        return setCssPosition({
          top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
          right: `calc(100% - ${wrapperRect.right}px)`
        });
      case 'bottom-left':
        return setCssPosition({
          top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
          left: `${wrapperRect.left}px`
        });
    }
  };

  const toggleOptions = () => {
    if (isShowingOptions) {
      setIsShowingOptions(false);
    } else {
      insertPortalRoot();
      cssPositionOptionsEl();
      setIsShowingOptions(true);
    }
  };

  const handleClicks = (event: MouseEvent) => {
    const hasClickedSelector =
      wrapperRef.current === event.target || wrapperRef.current?.contains(event.target as Node);

    if (hasClickedSelector) return;

    const hasClickedOutside =
      optionsRef.current !== event.target && !optionsRef.current?.contains(event.target as Node);

    if (hasClickedOutside) setIsShowingOptions(false);
  };

  useEffect(() => {
    if (isShowingOptions) {
      document.addEventListener('mousedown', handleClicks);
    } else {
      portalRoot?.remove();
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [isShowingOptions, portalRoot]);

  return (
    <Box onClick={toggleOptions}
      ref={wrapperRef}>
      {selector}

      {portalRoot &&
        isShowingOptions &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            cssPosition={cssPosition}
            ref={optionsRef}
            style={style}>
            {/* Render option menus */}
            {options.map((option, optionIndex) => (
              <Fragment key={optionIndex}>
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
                  {/* Render menu items */}
                  {option.menu.map((optionItem, optionItemIndex) => (
                    <li key={optionItemIndex}
                      onClick={() => onSelect(optionItem.value)}>
                      {typeof optionItem.label === 'string'
                        ? (
                          <Flex px='16px'
                            py='8px'>
                            <Text variant='b2m'>{optionItem.label}</Text>
                          </Flex>
                        )
                        : (
                          optionItem.label
                        )}
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

const Options = styled(Box)<{ cssPosition: CssPosition }>`
  position: absolute;
  background: white;
  box-shadow: ${({ theme }: ThemeProps) => theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;

  // Add only the necessary css positioning attributes
  ${({ cssPosition: { top } }) => top && `top: ${top};`}
  ${({ cssPosition: { right } }) => right && `right: ${right};`}
  ${({ cssPosition: { bottom } }) => bottom && `bottom: ${bottom};`}
  ${({ cssPosition: { left } }) => left && `left: ${left};`}

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: ${({ theme }: ThemeProps) => theme.colors.gray[4]};
      }
    }
  }
`;
