import React from 'react';
import { ContextMenu as ScMenu } from 'react-contextmenu';

import { styled } from '../../styles';

type Props = React.ComponentProps<typeof ScMenu>;
export interface MenuProps extends Props {
  onSelection: () => void;
}

export const Menu = styled(ScMenu)({
  background: '#fff',
  border: '1px solid #EBF0F7',
  boxShadow: '0px 1px 2px rgba(21, 41, 53, 0.24), 0px 1px 3px rgba(21, 41, 53, 0.12);',
  borderRadius: '8px',
  listStyleType: 'none',
  paddingLeft: 0,
  zIndex: 999,
  margin: '2px 0 0 0',
  '&:before': {
    border: 'inset 6px',
    content: '',
    display: 'block',
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    zIndex: 889
  },
  '&:after': {
    border: 'inset 7px',
    content: '',
    display: 'block',
    borderColor: 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #ccc rgba(0, 0, 0, 0)',
    borderBottomStyle: 'solid',
    zIndex: 888
  }
});
