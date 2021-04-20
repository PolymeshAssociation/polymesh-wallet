import { Box, Flex, Text } from '@polymathnetwork/extension-ui/ui';
import React, { CSSProperties, Fragment, useEffect, useRef, useState } from 'react';
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

type OptionSelectorProps = BoxProps & {
  options: Option[];
  selector: string | JSX.Element;
  onSelect: (value: any) => void;
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
  const { onSelect, options, position, selector, style, ...boxProps } = props;

  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [cssPosition, setCssPosition] = useState<CssPosition>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const portalRoot = document.getElementById(OPTION_SELECTOR_PORTAL_ID);

  const insertPortalRoot = () => {
    if (portalRoot) return;

    const root = document.getElementById('root');
    const createdPortalRoot = document.createElement('div');

    createdPortalRoot.id = OPTION_SELECTOR_PORTAL_ID;
    root?.appendChild(createdPortalRoot);
  };

  const cssPositionOptionsEl = () => {
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();

    if (!wrapperRect) return;

    // @TODO add options, or calculate where to render the options: bottom-left, bottom-right, top-left, top-right, etc.
    // Default: bottom-left
    if (position === 'bottom-right') {
      setCssPosition({
        top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
        right: `calc(100% - ${wrapperRect.right}px)`
      });
    } else {
      setCssPosition({
        top: `${wrapperRect.bottom + SELECTOR_SPACING}px`,
        left: `${wrapperRect.left}px`
      });
    }
  };

  const showOptions = () => {
    insertPortalRoot();
    cssPositionOptionsEl();
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
    } else {
      portalRoot?.remove();
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isShowingOptions, portalRoot]);

  return (
    <Box onClick={showOptions}
      ref={wrapperRef}>
      {selector}

      {isShowingOptions &&
        !!portalRoot &&
        ReactDOM.createPortal(
          <Options {...boxProps}
            cssPosition={cssPosition}
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
      <Flex
        px='16px'
        py='8px'>
        <Text variant='b2m'>{label}</Text>
      </Flex>
    )
    : (
      label
    );
}

const Options = styled(Box)<{ cssPosition: CssPosition }>`
  position: absolute;
  background: white;
  box-shadow: ${(props) => props.theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;

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
        background: ${(props) => props.theme.colors.gray[5]};
      }
    }
  }
`;

const SELECTOR_SPACING = 4;
const OPTION_SELECTOR_PORTAL_ID = 'option-selector-portal';
