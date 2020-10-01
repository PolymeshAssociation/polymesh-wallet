import React, { FC } from 'react';
import { BaseInputArea } from '../BaseInputArea';

type BaseInputProps = React.ComponentProps<typeof BaseInputArea>;

export interface Props extends BaseInputProps {
  height?: number;
  value?: string;
}

export const TextArea: FC<Props> = (props) => {
  const { name, ...otherProps } = props;

  return <BaseInputArea id={name}
    name={name}
    {...otherProps} />;
};
