/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, useCallback, useEffect, useReducer, useRef, useState } from 'react';
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

type PositionType = 'context' | 'bottom-left' | 'bottom-right'; // Add more positioning as needed

type OptionSelectorProps = BoxProps & {
  options: Option[];
  selector: string | JSX.Element;
  onSelect: (value: any) => void;
  position?: PositionType;
  style?: CSSProperties;
};

type CssPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

type ClickCoords = {
  x: number;
  y: number;
};

type OptionSelectorState = {
  shouldRenderOptions: boolean;
  cssPosition: CssPosition;
  portalRoot?: HTMLDivElement;
  clickCoords?: ClickCoords;
  optionsRef?: React.RefObject<HTMLDivElement>;
};

type OptionSelectorActions =
  | { type: 'show'; payload: ClickCoords }
  | { type: 'hide' }
  | { type: 'setOptionsRef'; payload: React.RefObject<HTMLDivElement> }
  | {
    type: 'setCssPosition';
    payload: {
      position: PositionType;
      selectorRef: React.RefObject<HTMLDivElement>;
    };
  };

const defaultState: OptionSelectorState = {
  shouldRenderOptions: false,
  cssPosition: {}
};

function reducer (state: OptionSelectorState, action: OptionSelectorActions): OptionSelectorState {
  switch (action.type) {
    case 'show': {
      const root = document.getElementById('root');
      const createdPortalRoot = document.createElement('div');

      createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
      root?.appendChild(createdPortalRoot);

      return {
        ...state,
        shouldRenderOptions: true,
        clickCoords: action.payload,
        portalRoot: createdPortalRoot
      };
    }

    case 'hide': {
      state.portalRoot?.remove();

      return {
        ...defaultState
      };
    }

    case 'setOptionsRef':
      return {
        ...state,
        optionsRef: action.payload
      };

    case 'setCssPosition': {
      const { clickCoords, optionsRef } = state;
      const { selectorRef } = action.payload;

      if (!selectorRef.current || !optionsRef?.current || !clickCoords) return state;

      const selectorRect = selectorRef.current.getBoundingClientRect();
      const optionsRect = optionsRef.current.getBoundingClientRect();

      let cssPosition: CssPosition = {};

      switch (action.payload.position) {
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

          cssPosition = {
            top,
            left
          };
          break;
        }

        case 'bottom-right':
          cssPosition = {
            top: selectorRect.bottom + SELECTOR_SPACING,
            left: selectorRect.left + selectorRect.width - optionsRect.width
          };
          break;

        case 'bottom-left':
          cssPosition = {
            top: selectorRect.bottom + SELECTOR_SPACING,
            left: selectorRect.left
          };
          break;
      }

      return {
        ...state,
        cssPosition
      };
    }

    default:
      return state;
  }
}

function OptionSelectorComponent (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, position = 'context', selector, style, ...boxProps } = props;

  const [state, dispatch] = useReducer(reducer, defaultState);

  const selectorRef = useRef<HTMLDivElement>(null);

  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    dispatch({ type: 'setOptionsRef', payload: { current: node } });
  }, []);

  const toggleOptions: React.MouseEventHandler = (event) => {
    event.stopPropagation();

    if (state.shouldRenderOptions) {
      dispatch({ type: 'hide' });
    } else {
      dispatch({ type: 'show', payload: { x: event.clientX, y: event.clientY } });
    }
  };

  const handleClicks = useCallback(
    (event: MouseEvent) => {
      const hasClickedSelector =
        selectorRef.current === event.target || selectorRef.current?.contains(event.target as Node);

      if (hasClickedSelector) return; // Handled by toggleOptions

      const hasClickedOutside =
        state.optionsRef?.current !== event.target && !state.optionsRef?.current?.contains(event.target as Node);

      // if (hasClickedOutside) setShouldRenderOptions(false);
      if (hasClickedOutside) dispatch({ type: 'hide' });
    },
    [state.optionsRef]
  );

  // Add and remove click listener to hide options when clicked outside
  useEffect(() => {
    if (state.shouldRenderOptions) {
      document.addEventListener('mousedown', handleClicks);

      dispatch({
        type: 'setCssPosition',
        payload: {
          position,
          selectorRef
        }
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [handleClicks, position, state.shouldRenderOptions]);

  return (
    <>
      <Box onClick={toggleOptions}
        ref={selectorRef}>
        {selector}
      </Box>

      {state.shouldRenderOptions &&
        state.portalRoot &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            cssPosition={state.cssPosition}
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
          state.portalRoot
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
