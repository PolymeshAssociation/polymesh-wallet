import type { CSSProperties, RefObject } from 'react';
import type { BoxProps } from '@polymeshassociation/extension-ui/ui/Box';
import type { Coordinates, CssPosition, Option, PositionType } from './types';

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { Box, Text } from '@polymeshassociation/extension-ui/ui';

import { OptionListItem } from './OptionItem';
import { Options } from './styles';

const SELECTOR_SPACING = 4;
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';

type OptionSelectorProps = BoxProps & {
  options: Option[];
  selector: string | React.ReactElement;
  onSelect: (value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  position?: PositionType;
  style?: CSSProperties;
  className?: string;
};

export function OptionSelector (props: OptionSelectorProps): React.ReactElement {
  const { className,
    onSelect,
    options,
    position = 'context',
    selector,
    style,
    ...boxProps } = props;

  const [showOptions, setShowOptions] = useState(false);
  const [cssPosition, setCssPosition] = useState<CssPosition>({});
  const [clickCoords, setClickCoords] = useState<Coordinates>();
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>();

  const selectorRef = useRef<HTMLDivElement>(null);

  // Using a callback ref to set optionsRef since it is rendered conditionally
  const [optionsRef, setOptionsRef] = useState<RefObject<HTMLDivElement>>({
    current: null
  });
  const optionsCallbackRef = useCallback((node: HTMLDivElement) => {
    setOptionsRef({ current: node });
  }, []);

  const shouldRenderOptions = !!(showOptions && portalRoot);

  const toggleOptions: React.MouseEventHandler = useCallback((event) => {
    event.stopPropagation();

    if (showOptions) {
      setShowOptions(false);
    } else {
      const root = document.getElementById('root');
      const createdPortalRoot = document.createElement('div');

      createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
      root?.appendChild(createdPortalRoot);

      setClickCoords({
        x: event.clientX,
        y: event.clientY
      });
      setPortalRoot(createdPortalRoot);
      setShowOptions(true);
    }
  }, [showOptions]);

  const handleClicks = useCallback(
    (event: MouseEvent) => {
      const hasClickedSelector =
        selectorRef.current === event.target ||
        selectorRef.current?.contains(event.target as Node);

      if (hasClickedSelector) {
        return;
      } // Handled by toggleOptions

      const hasClickedOutside =
        optionsRef.current !== event.target &&
        !optionsRef.current?.contains(event.target as Node);

      if (hasClickedOutside) {
        setShowOptions(false);
      }
    },
    [optionsRef]
  );

  const positionOptionsEl = useCallback(() => {
    if (!selectorRef.current || !optionsRef.current || !clickCoords) {
      return;
    }

    const selectorRect = selectorRef.current.getBoundingClientRect();
    const optionsRect = optionsRef.current.getBoundingClientRect();

    switch (position) {
      // Position to show the options in available viewing area
      case 'context': {
        let top = clickCoords.y;
        let left = clickCoords.x;

        const isOverflowingBottom =
          clickCoords.y + optionsRect.height > document.body.clientHeight;
        const isOverflowingRight =
          clickCoords.x + optionsRect.width > document.body.clientWidth;

        if (isOverflowingBottom) {
          top -= optionsRect.height;
        } // Flip on y-axis

        if (isOverflowingRight) {
          left -= optionsRect.width;
        } // Flip on x-axis

        return setCssPosition({
          left,
          top
        });
      }

      case 'bottom-right':
        return setCssPosition({
          left: selectorRect.left + selectorRect.width - optionsRect.width,
          top: selectorRect.bottom + SELECTOR_SPACING
        });

      case 'bottom-left':
        return setCssPosition({
          left: selectorRect.left,
          top: selectorRect.bottom + SELECTOR_SPACING
        });
    }
  }, [clickCoords, optionsRef, position]);

  // Add and remove click listener to hide options when clicked outside
  useEffect(() => {
    if (shouldRenderOptions) {
      document.addEventListener('mousedown', handleClicks);
    }

    return () => {
      document.removeEventListener('mousedown', handleClicks);
    };
  }, [handleClicks, shouldRenderOptions]);

  // Position options element after rendering, otherwise remove portal root after hiding options
  useEffect(() => {
    shouldRenderOptions ? positionOptionsEl() : portalRoot?.remove();
  }, [portalRoot, positionOptionsEl, shouldRenderOptions]);

  // Reset cssPosition after hiding options
  useEffect(() => {
    if (!shouldRenderOptions && Object.values(cssPosition).length) {
      setCssPosition({});
    }
  }, [cssPosition, shouldRenderOptions]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation(), []);

  return (
    <>
      <Box
        className={className}
        onClick={toggleOptions}
        ref={selectorRef}
      >
        {selector}
      </Box>
      {shouldRenderOptions &&
        ReactDOM.createPortal(
          <Options
            {...boxProps}
            cssPosition={cssPosition}
            onClick={handleClick}
            ref={optionsCallbackRef}
            style={style}
          >
            {/* Render option menus */}
            {options.map((option, optionIndex) => (
              <Fragment key={optionIndex}>
                {option.category && (
                  <Box
                    mx='16px'
                    textAlign='left'
                  >
                    <Text
                      color='gray.2'
                      variant='b2m'
                    >
                      {option.category}
                    </Text>
                  </Box>
                )}
                <ul>
                  {/* Render menu items */}
                  {option.menu.map((optionItem, optionItemIndex) => (
                    <OptionListItem
                      key={optionItemIndex}
                      onSelect={onSelect}
                      optionItem={optionItem}
                    />
                  ))}
                </ul>
                {option.submenu}
              </Fragment>
            ))}
          </Options>,
          portalRoot
        )}
    </>
  );
}
