import type { CSSObject } from 'styled-components';
import type { Styles } from '../../styles/types';
import type { TooltipProps } from './definitions';

import { createGlobalStyle } from 'styled-components';

import { TooltipDefaultProps } from './definitions';

const arrowSize = 8;

export const TippyStyles = createGlobalStyle`
  .tippy-box {
    z-index: 9999;
  }
  .tippy-box[data-placement^="top"] > .tippy-arrow {
      bottom: 0;
  }
  .tippy-box[data-placement^="top"] > .tippy-arrow:before {
      bottom: -7px;
      left: 0;
      border-width: ${arrowSize}px ${arrowSize}px 0;
      border-top-color: initial;
      transform-origin: center top;
  }
  .tippy-box[data-placement^="bottom"] > .tippy-arrow {
      top: 0;
  }
  .tippy-box[data-placement^="bottom"] > .tippy-arrow:before {
      top: -7px;
      left: 0;
      border-width: 0 ${arrowSize}px ${arrowSize}px;
      border-bottom-color: initial;
      transform-origin: center bottom;
  }
  .tippy-box[data-placement^="left"] > .tippy-arrow {
      right: 0;
  }
  .tippy-box[data-placement^="left"] > .tippy-arrow:before {
      border-width: ${arrowSize}px 0 ${arrowSize}px ${arrowSize}px;
      border-left-color: initial;
      right: -7px;
      transform-origin: center left;
  }
  .tippy-box[data-placement^="right"] > .tippy-arrow {
      left: 0;
  }
  .tippy-box[data-placement^="right"] > .tippy-arrow:before {
      left: -7px;
      border-width: ${arrowSize}px ${arrowSize}px ${arrowSize}px 0;
      border-right-color: initial;
      transform-origin: center right;
  }
  .tippy-box[data-inertia][data-state="visible"] {
      transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
  }
  .tippy-arrow {
      width: ${arrowSize * 2}px;
      height: ${arrowSize * 2}px;
      color: #1E1E1E;
  }
  .tippy-arrow:before {
      content: "";
      position: absolute;
      border-color: transparent;
      border-style: solid;
  }
  .tippy-content {
      position: relative;
      padding: 5px 9px;
      z-index: 1;
  }
  .tippy-box[data-animation=shift-away][data-state=hidden]{opacity:0}.tippy-box[data-animation=shift-away][data-state=hidden][data-placement^=top]{transform:translateY(10px)}.tippy-box[data-animation=shift-away][data-state=hidden][data-placement^=bottom]{transform:translateY(-10px)}.tippy-box[data-animation=shift-away][data-state=hidden][data-placement^=left]{transform:translateX(10px)}.tippy-box[data-animation=shift-away][data-state=hidden][data-placement^=right]{transform:translateX(-10px)}
`;

export const tooltipStyles: CSSObject = {
  cursor: 'auto',
  userSelect: 'auto'
};

export const getVariant: Styles<TooltipProps> = ({ theme,
  variant = TooltipDefaultProps.variant }) =>
  ({
    primary: {
      backgroundColor: theme.colors.gray[1],
      borderRadius: theme.radii[3],
      boxShadow: theme.shadows[1],
      color: 'white',
      fontSize: theme.fontSizes[0],
      maxWidth: '15rem',
      padding: `${theme.space[0]} ${theme.space[0]}`
    },
    raw: {},
    secondary: {
      backgroundColor: 'white',
      border: '1px solid #EBF0F7',
      boxShadow: theme.shadows[3],
      color: 'black',
      fontSize: theme.fontSizes.baseText,
      fontWeight: 'normal' as const,
      lineHeight: theme.lineHeights.normal,
      maxWidth: '15rem',
      padding: `${theme.space[1]} ${theme.space[3]}`,
      wordWrap: 'break-word' as const
    }
  }[variant]);
