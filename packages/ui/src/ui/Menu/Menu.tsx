import React from 'react';
import { Menu as ScMenu } from 'react-aria-menubutton';
import { styled } from '../../styles';

type Props = React.ComponentProps<typeof ScMenu>;
export interface MenuProps extends Props {
  onSelection: () => void;
}

// @ts-ignore
export const Menu: React.ReactElement<MenuProps> = styled(ScMenu)({
  background: '#fff',
  border: '1px solid #EBF0F7',
  boxShadow: '0px 1px 2px rgba(21, 41, 53, 0.24), 0px 1px 3px rgba(21, 41, 53, 0.12);',
  borderRadius: '8px',
  listStyleType: 'none',
  paddingLeft: 0,
  position: 'absolute',
  top: '100%',
  left: -180,
  zIndex: 99,
  margin: '2px 0 0 0',
  width: '200px',
  maxWidth: '200px',
  '&:before': {
    border: 'inset 6px',
    content: '',
    display: 'block',
    height: 0,
    width: 0,
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    position: 'absolute',
    top: '-12px',
    left: '-12px',
    zIndex: 89
  },
  '&:after': {
    border: 'inset 7px',
    content: '',
    display: 'block',
    height: 0,
    width: 0,
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #ccc rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    position: 'absolute',
    top: '-14px',
    left: '1px',
    zIndex: 88
  }
});
