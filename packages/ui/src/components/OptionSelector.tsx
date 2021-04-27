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
  position?: 'context' | 'bottom-left' | 'bottom-right'; // Add more positioning as needed
  style?: CSSProperties;
};

type CssPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

function OptionSelectorComponent (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, position = 'context', selector, style, ...boxProps } = props;

  const [shouldRenderOptions, setShouldRenderOptions] = useState(false);
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number }>();
  const [cssPosition, setCssPosition] = useState<CssPosition>({});
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>();
  const [optionsRef, setOptionsRef] = useState<React.RefObject<HTMLDivElement>>({ current: null });

  const selectorRef = useRef<HTMLDivElement>(null);

  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    setOptionsRef({ current: node });
  }, []);

  // const portalRoot = document.getElementById(OPTION_SELECTOR_PORTAL_ID);

  const insertPortalRoot = () => {
    const root = document.getElementById('root');
    const createdPortalRoot = document.createElement('div');

    createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
    root?.appendChild(createdPortalRoot);

    setPortalRoot(createdPortalRoot);
  };

  const toggleOptions: React.MouseEventHandler = (event) => {
    event.stopPropagation();

    if (shouldRenderOptions) {
      setShouldRenderOptions(false);
    } else {
      setClickCoords({ x: event.clientX, y: event.clientY });
      setShouldRenderOptions(true);
    }
  };

  const handleClicks = useCallback(
    (event: MouseEvent) => {
      const hasClickedSelector =
        selectorRef.current === event.target || selectorRef.current?.contains(event.target as Node);

      if (hasClickedSelector) return; // Handled by toggleOptions

      const hasClickedOutside =
        optionsRef.current !== event.target && !optionsRef.current?.contains(event.target as Node);

      if (hasClickedOutside) setShouldRenderOptions(false);
    },
    [optionsRef]
  );

  // Add and remove click listener to hide options when clicked outside
  useEffect(() => {
    if (shouldRenderOptions) {
      document.addEventListener('mousedown', handleClicks);

      if (!portalRoot) {
        insertPortalRoot();
      }
    } else {
      portalRoot?.remove();
      setPortalRoot(undefined);
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [handleClicks, portalRoot, shouldRenderOptions]);

  // Position option selector
  useEffect(() => {
    if (!selectorRef.current || !optionsRef.current) return;

    const selectorRect = selectorRef.current.getBoundingClientRect();
    const optionsRect = optionsRef.current.getBoundingClientRect();

    if (!selectorRect || !clickCoords) return;

    console.log({ clickCoords, optionsRect });

    switch (position) {
      case 'context': {
        let top = clickCoords.y;
        let left = clickCoords.x;

        // flip on x-axis
        if (clickCoords.x + optionsRect.width > document.body.clientWidth) {
          left = clickCoords.x - optionsRect.width;
        }

        // flip on y-axis
        if (clickCoords.y + optionsRect.height > document.body.clientHeight) {
          top = clickCoords.y - optionsRect.height;
        }

        setCssPosition({
          top,
          left
        });
        break;
      }

      case 'bottom-right':
        setCssPosition({
          top: selectorRect.bottom + SELECTOR_SPACING,
          left: selectorRect.left + selectorRect.width - optionsRect.width
        });
        break;

      case 'bottom-left':
        setCssPosition({
          top: selectorRect.bottom + SELECTOR_SPACING,
          left: selectorRect.left
        });
        break;
    }
  }, [clickCoords, optionsRef, position]);

  return (
    <>
      <Box onClick={toggleOptions}
        ref={selectorRef}>
        {selector}
      </Box>

      {shouldRenderOptions &&
        portalRoot &&
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
    </>
  );
}

export const OptionSelector = React.memo(OptionSelectorComponent, () => true);

const Options = styled(Box)<{ cssPosition: CssPosition }>`
  position: absolute;
  background: white;
  box-shadow: ${({ theme }: ThemeProps) => theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;

  ${({ cssPosition }) => cssPosition}

  visibility: ${({ cssPosition }) => (Object.values(cssPosition).length ? 'visible' : 'hidden')};

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
