/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import { BoxProps } from '@polymathnetwork/extension-ui/ui/Box';
import React, { CSSProperties, Fragment, RefObject, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { initialState, reducer } from './reducer';
import { Options } from './styles';
import { CssPosition, Option, PositionType } from './types';

const SELECTOR_SPACING = 4;
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';

type OptionSelectorProps = BoxProps & {
  options: Option[];
  selector: string | JSX.Element;
  onSelect: (value: any) => void;
  position?: PositionType;
  style?: CSSProperties;
};

export function OptionSelector (props: OptionSelectorProps): JSX.Element {
  const { onSelect, options, position = 'context', selector, style, ...boxProps } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const [cssPosition, setCssPosition] = useState<CssPosition>({});

  const selectorRef = useRef<HTMLDivElement>(null);

  // Using a callback ref to set optionsRef since it is rendered conditionally
  const [optionsRef, setOptionsRef] = useState<RefObject<HTMLDivElement>>({ current: null });
  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    setOptionsRef({ current: node });
  }, []);

  const toggleOptions: React.MouseEventHandler = (event) => {
    event.stopPropagation();

    if (state.shouldRenderOptions) {
      dispatch({ type: 'hide' });
    } else {
      dispatch({
        type: 'show',
        payload: {
          x: event.clientX,
          y: event.clientY
        }
      });
    }
  };

  const handleClicks = useCallback(
    (event: MouseEvent) => {
      const hasClickedSelector =
        selectorRef.current === event.target || selectorRef.current?.contains(event.target as Node);

      if (hasClickedSelector) return; // Handled by toggleOptions

      const hasClickedOutside =
        optionsRef.current !== event.target && !optionsRef.current?.contains(event.target as Node);

      if (hasClickedOutside) dispatch({ type: 'hide' });
    },
    [optionsRef]
  );

  // Add and remove click listener to hide options when clicked outside
  useEffect(() => {
    if (state.shouldRenderOptions) {
      const { clickCoords } = state;

      if (!selectorRef.current || !optionsRef.current || !clickCoords) return;

      const selectorRect = selectorRef.current.getBoundingClientRect();
      const optionsRect = optionsRef.current.getBoundingClientRect();

      let cssPosition: CssPosition = {};

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

      setCssPosition(cssPosition);

      document.addEventListener('mousedown', handleClicks);
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [handleClicks, optionsRef, position, state, state.shouldRenderOptions]);

  console.log('render');

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
          state.portalRoot
        )}
    </>
  );
}
