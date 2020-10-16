import styled from 'styled-components';
import { color as colorProp, ColorProps } from 'styled-system';

export type HrProps = {
  height?: number;
} & ColorProps & {
    color?: string;
  };

export const Hr = styled.hr<HrProps>(colorProp, (props) => ({
  width: '100%',
  border: `${(props.height ? props.height : 2) / 2}px solid currentColor`,
  borderRadius: `${(props.height ? props.height : 2) / 2}px`,
  margin: `calc(${props.theme.space.gridGap} / 2) auto`,
}));

Hr.defaultProps = {
  color: 'gray.4',
  height: 2,
  bg: 'initial',
};
