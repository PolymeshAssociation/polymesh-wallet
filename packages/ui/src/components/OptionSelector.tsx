/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
  position?: 'context' | 'bottom-left' | 'bottom-right';
  style?: CSSProperties;
};

type CssPosition = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, position = 'context', selector, style, ...boxProps } = props;

  const [showOptions, setShowOptions] = useState(false);
  const [cssPosition, setCssPosition] = useState<CssPosition>({});
  const [optionClickEvent, setOptionClickEvent] = useState<MouseEvent>();
  const [optionsRef, setOptionsRef] = useState<React.RefObject<HTMLDivElement>>({ current: null });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    setOptionsRef({ current: node });
  }, []);

  const portalRoot = document.getElementById(OPTION_SELECTOR_PORTAL_ID);

  const insertPortalRoot = () => {
    const root = document.getElementById('root');
    const createdPortalRoot = document.createElement('div');

    createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
    root?.appendChild(createdPortalRoot);
  };

  // const cssPositionOptionsEl = useCallback(() => {
  //   const wrapperRect = wrapperRef.current?.getBoundingClientRect();

  //   console.log(optionsRef, optionClickEvent);

  //   if (!wrapperRect || option) return;

  //   switch (position) {
  //     case 'context':
  //       return setCssPosition({
  //         top: `${optionClickEvent.clientY}px`,
  //         left: `${optionClickEvent.clientX}px`
  //       });
  //     case 'bottom-right':
  //       return setCssPosition({
  //         top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
  //         right: `calc(100% - ${wrapperRect.right}px)`
  //       });
  //     case 'bottom-left':
  //       return setCssPosition({
  //         top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
  //         left: `${wrapperRect.left}px`
  //       });
  //   }
  // }, [optionClickEvent, optionsRef, position]);

  const toggleOptions = (e: MouseEvent) => {
    if (showOptions) {
      setShowOptions(false);
    } else {
      insertPortalRoot();
      setOptionClickEvent(e);
      setShowOptions(true);
    }
  };

  const handleClicks = useCallback(
    (event: MouseEvent) => {
      const hasClickedSelector =
        wrapperRef.current === event.target || wrapperRef.current?.contains(event.target as Node);

      if (hasClickedSelector) return;

      const hasClickedOutside =
        optionsRef.current !== event.target && !optionsRef.current?.contains(event.target as Node);

      if (hasClickedOutside) setShowOptions(false);
    },
    [optionsRef]
  );

  useEffect(() => {
    if (showOptions) {
      document.addEventListener('mousedown', handleClicks);
    } else {
      portalRoot?.remove();
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [handleClicks, showOptions, portalRoot]);

  useEffect(() => {
    if (!wrapperRef.current || !optionsRef.current) return;

    if (showOptions && portalRoot) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const optionsRect = optionsRef.current.getBoundingClientRect();

      console.log({ optionsRect, optionClickEvent });

      if (!wrapperRect || !optionClickEvent) return;

      switch (position) {
        case 'context':
          return setCssPosition({
            top: `${optionClickEvent.clientY}px`,
            left: `${optionClickEvent.clientX}px`
          });
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
    }
  }, [optionClickEvent, optionsRef, portalRoot, position, showOptions]);

  return (
    <Box onClick={toggleOptions}
      ref={wrapperRef}>
      {selector}

      {portalRoot &&
        showOptions &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            cssPosition={cssPosition}
            ref={optionsCallbackRef}
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
