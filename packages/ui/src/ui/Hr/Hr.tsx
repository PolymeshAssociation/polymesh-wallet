import type { ColorProps } from 'styled-system';

import styled from 'styled-components';
import { color as colorProp } from 'styled-system';

export type HrProps = {
  height?: number;
} & ColorProps & {
  color?: string;
};

export const Hr = styled.hr<HrProps>(colorProp, (props) => ({
  border: `${(props.height ? props.height : 2) / 2}px solid currentColor`,
  borderRadius: `${(props.height ? props.height : 2) / 2}px`,
  width: '100%'
}));

Hr.defaultProps = {
  bg: 'initial',
  color: 'gray7',
  height: 2
};
