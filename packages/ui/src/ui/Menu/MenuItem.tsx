import React from 'react';
import { MenuItem as ScMenuItem } from 'react-contextmenu';

import { styled } from '../../styles';

type Props = React.ComponentProps<typeof ScMenuItem>;
export interface MenuProps extends Props {
  onSelection: () => void;
}

export const MenuItem = styled(ScMenuItem)({
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
