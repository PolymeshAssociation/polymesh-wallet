// import { createGlobalStyle } from '../../styles';
import { createGlobalStyle } from 'styled-components';

import { Styles } from '../../styles/types';
import { TooltipDefaultProps, TooltipProps } from './definitions';

const arrowSize = 8;

export const TippyStyles = createGlobalStyle`
  .tippy-box {
    z-index: ${({ theme }) => theme.zIndexes.tooltips};    
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
      color: currentColor;
      filter: invert(1);
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
`;

export const tooltipStyles: Styles = () => ({
  userSelect: 'auto',
  cursor: 'auto'
});

export const getVariant: Styles<TooltipProps> = ({ theme, variant = TooltipDefaultProps.variant }) =>
  ({
    primary: {
      boxShadow: theme.shadows[1],
      maxWidth: '15rem',
      borderRadius: theme.radii[1],
      backgroundColor: theme.colors.gray[1],
      color: 'white',
      padding: `${theme.space[1]} ${theme.space[3]}`,
      fontSize: theme.fontSizes[0]
    },
    secondary: {
      boxShadow: theme.shadows[3],
      maxWidth: '15rem',
      backgroundColor: 'white',
      color: 'black',
      padding: `${theme.space[1]} ${theme.space[3]}`,
      border: '1px solid #EBF0F7',
      wordWrap: 'break-word' as const,
      fontWeight: 'normal' as const,
      lineHeight: theme.lineHeights.normal,
      fontSize: theme.fontSizes.baseText
    },
    raw: {}
  }[variant]);
