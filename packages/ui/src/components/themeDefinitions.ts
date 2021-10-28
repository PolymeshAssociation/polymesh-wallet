/* eslint-disable prefer-destructuring */
import { darken } from 'polished';

export const breakpoints = {
  sm: 0,
  md: '42.5em', // 680px
  lg: '64em', // 1024px
  xl: '80em' // 1280px
};

export const fontSizes = {
  0: '0.75rem', // 12px
  1: '0.875rem', // 14px
  2: '1rem', // 16px
  3: '1.125rem', // 18px
  4: '1.25rem', // 20px
  5: '1.5rem', // 24px
  6: '1.75rem', // 28px
  7: '2.125rem', // 34px
  8: '2.625rem', // 42px
  9: '3rem', // 48px
  10: '3.75rem', // 60px,
  baseText: '1rem'
};

export const borderWidths = {
  0: '0px',
  1: '1px'
};

export const fontFamilies = {
  baseText: 'Poppins',
  code: 'CodeFont, monospace, sans-serif'
};

export const lineHeights = {
  none: '1rem', // 16 px
  extraTight: '1.125rem', // 18px
  tighter: '1.166rem', // 18.66px
  tight: '1.313rem', // 21px
  lessTight: '1.452rem', // for fontSize 20px it is 29px
  normal: '1.5rem', // 24px
  loose: '1.75rem', // 28px
  medium: '2.1rem', // 33.6px
  large: '2.975', // 47.6px
  xlarge: '4.2rem' // 67.2px
};

export type TFontWeightCustom = 'light' | 'normal' | 'semiBold' | 'bold' | 'strong';

export const fontWeights = {
  light: 300,
  normal: 400,
  semiBold: 500,
  bold: 600,
  strong: 700
};

export const space = {
  0: '0',
  1: '5px',
  2: '10px',
  3: '16px',
  4: '24px',
  5: '36px',
  6: '48px',
  7: '80px',
  8: '120px',

  xxs: '2px',
  xs: '5px',
  s: '10px',
  m: '16px',
  l: '36px',
  xl: '48px',
  xxl: '80px',
  xxxl: '120px',
  formGap: '21px',
  gridGap: '24px',

  '-0': '-0',
  '-1': '-5px',
  '-2': '-10px',
  '-3': '-16px',
  '-4': '-24px',
  '-5': '-36px',
  '-6': '-48px',
  '-7': '-80px',
  '-8': '-120px',

  '-xs': '-5px',
  '-s': '-10px',
  '-m': '-16px',
  '-l': '-36px',
  '-xl': '-48px',
  '-xxl': '-80px',
  '-xxxl': '-120px',
  '-formGap': '-21px',
  '-gridGap': '-24px'
};

export const zIndexes = {
  header: 80,
  sidebar: 100,
  modals: 120,
  selects: 140,
  tooltips: 9999
};

const _colors = {
  polyIndigo: '#43195B',
  polyFucisa: '#D557EA',
  polyPink: '#EC4673',
  polyPinkLight: '#FAD1DC',
  polyMalachite: '#60D3CB',
  polyMalachiteLight: '#D7F4F2',
  polyNavyBlue: '#170087',
  polyNavyBlueDark: '#100255',
  polyNavyBlueLight1: '#F2EFFF',
  polyNavyBlueLight2: '#DCD3FF',
  white: '#FFFFFF',
  grayBg: '#FBFBFB',
  gray8: '#F5F5F5',
  gray7: '#F0F0F0',
  gray6: '#C7C7C7',
  gray5: '#8F8F8F',
  gray4: '#727272',
  gray3: '#565656',
  gray2: '#3A3A3A',
  gray1: '#1E1E1E',
  success1: '#00AA5E',
  success2: '#D4F7E7',
  warning1: '#EFC100',
  warning2: '#FBF3D0',
  warning3: '#E3A30C',
  danger1: '#DB2C3E',
  danger2: '#FAE6E8',
  gray: ['#FFFFFF', '#1E1E1E', '#565656', '#727272', '#8F8F8F', '#F0F0F0'],
  brandMain: '#EC4673',
  brandLightest: '#FAD1DC',
  brandLighter: '#DCD3FF',

  // Previous branding color names
  brandBg: '#FAFDFF',
  brandDark: '#0024BD',
  brandDarkest: '#170087',
  info: '#2574B5',
  green: ['#00AA5E', '#0B6B40', '#D4F7E7'],
  yellow: ['#EFC100', '#FBF3D0', '#E3A30C'],
  red: ['#DB2C3E', '#FAE6E8']
};

const gradients = {
  gradient1: 'linear-gradient(193.19deg, #FF2E72 5.7%, #4A125E 91.16%)'
};

export const colors = {
  ..._colors,
  baseText: _colors.gray1,
  highlightText: _colors.gray1,
  placeholder: _colors.gray5,
  inactive: _colors.gray4,
  disabled: _colors.gray7,
  primary: _colors.polyPink,
  secondary: _colors.polyPinkLight,
  idle: _colors.polyPinkLight,
  alert: _colors.danger1,
  warning: _colors.warning1,
  success: _colors.success1,
  gradient: gradients.gradient1
};

export const shadows = {
  0: '',
  1: '0px 1px 3px rgba(30, 30, 30, 0.12), 0px 1px 2px rgba(30, 30, 30, 0.24);',
  2: '0px 2px 4px rgba(30, 30, 30, 0.16), 0px 3px 6px rgba(30, 30, 30, 0.12);',
  3: '0px 10px 20px rgba(30, 30, 30, 0.15), 0px 3px 6px rgba(30, 30, 30, 0.1);',
  4: '0px 15px 25px rgba(30, 30, 30, 0.15), 0px 5px 10px rgba(30, 30, 30, 0.05);',
  5: '0px 20px 40px rgba(30, 30, 30, 0.1);'
};

export const radii = {
  0: '0px',
  1: '2px',
  2: '4px',
  3: '8px',
  4: '16px'
};

export type TTextVariant = 'b1m' | 'b1' | 'b2m' | 'b2' | 'b3m' | 'b3' | 'sh1' | 'c1' | 'c2' | 'c2m' | 'code';

export const texts = {
  b1: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[2],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal
  },
  b1m: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[2],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.normal
  },
  b2: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[1],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight
  },
  b2m: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[1],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight
  },
  b3: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[0],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.extraTight
  },
  b3m: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[0],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.extraTight
  },
  sh1: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray3,
    fontSize: fontSizes[3],
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.normal
  },
  c1: {
    fontFamily: fontFamilies.baseText,
    color: colors.gray1,
    fontSize: fontSizes[1],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.semiBold,
    letterSpacing: '4%'
  },
  c2: {
    fontFamily: fontFamilies.baseText,
    color: colors.polyPink,
    fontSize: fontSizes[0],
    lineHeight: lineHeights.none,
    fontWeight: fontWeights.normal,
    letterSpacing: '4%'
  },
  c2m: {
    fontFamily: fontFamilies.baseText,
    color: colors.polyPink,
    fontSize: fontSizes[0],
    lineHeight: lineHeights.none,
    fontWeight: fontWeights.semiBold,
    letterSpacing: '4%'
  },
  code: {
    fontFamily: fontFamilies.code,
    color: colors.gray1,
    fontSize: fontSizes[0],
    lineHeight: lineHeights.tighter,
    fontWeight: fontWeights.normal,
    letterSpacing: '4%'
  }
};

export const headings = {
  h1: {
    color: colors.gray1,
    fontSize: fontSizes[9],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.xlarge,
    letterSpacing: -1
  },
  h2: {
    color: colors.gray1,
    fontSize: fontSizes[7],
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.large,
    letterSpacing: -0.5
  },
  h3: {
    color: colors.gray1,
    fontSize: fontSizes[5],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.medium,
    letterSpacing: -0.25
  },
  h4: {
    color: colors.gray1,
    fontSize: fontSizes[4],
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.loose
  },
  h5: {
    color: colors.gray1,
    fontSize: fontSizes[3],
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0.15,
    lineHeight: lineHeights.loose
  },
  h6: {
    color: colors.gray1,
    fontSize: fontSizes.baseText,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal
  }
};

export const links = {
  color: colors.polyPink,
  '&:hover, &:focus': {
    color: darken(0.2, colors.polyPinkLight)
  }
};

export const transitions = {
  hover: {
    ms: 150
  },
  modal: {
    ms: 200
  }
};

const _maxWidth = {
  0: '500px',
  1: '700px',
  2: '850px',
  3: '1000px',
  4: '1600px'
};

export const maxWidth = {
  ..._maxWidth,
  xs: _maxWidth[0],
  s: _maxWidth[1],
  m: _maxWidth[2],
  l: _maxWidth[3],
  xl: _maxWidth[4]
};

export const header = {
  height: '48px'
};

export const sidebar = {
  width: '124px'
};

export const footer = {
  height: header.height
};
