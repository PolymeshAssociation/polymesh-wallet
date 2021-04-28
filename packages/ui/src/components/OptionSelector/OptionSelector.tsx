/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import { BoxProps } from '@polymathnetwork/extension-ui/ui/Box';
import React, { CSSProperties, Fragment, useCallback, useEffect, useReducer, useRef } from 'react';
import ReactDOM from 'react-dom';

import { initialState, reducer } from './reducer';
import { Options } from './styles';
import { Option, PositionType } from './types';

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

  const selectorRef = useRef<HTMLDivElement>(null);

  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    dispatch({
      type: 'setOptionsRef',
      payload: { current: node }
    });
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
        state.optionsRef?.current !== event.target && !state.optionsRef?.current?.contains(event.target as Node);

      if (hasClickedOutside) dispatch({ type: 'hide' });
    },
    [state.optionsRef]
  );

  // Add and remove click listener to hide options when clicked outside
  useEffect(() => {
    if (state.shouldRenderOptions) {
      dispatch({
        type: 'setCssPosition',
        payload: {
          position,
          selectorRef
        }
      });

      document.addEventListener('mousedown', handleClicks);
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
