import React from 'react';
import { MenuItem as ScMenuItem } from 'react-aria-menubutton';
import { styled } from '../../styles';

type Props = React.ComponentProps<typeof ScMenuItem>;
export interface MenuProps extends Props {
  onSelection: () => void;
}

// @ts-ignore
export const MenuItem: React.ReactElement<MenuProps> = styled(ScMenuItem)({
  cursor: 'pointer',
  color: '#555',
  padding: '0.5rem',
  '&:hover': {
    background: '#eee'
  },
  '&:focus': {
    background: '#eee'
  },
  '&:after': {
    content: '',
    display: 'table',
    clear: 'both'
  }
});
