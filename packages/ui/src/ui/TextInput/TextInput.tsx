import React, { FC } from 'react';
import { BaseInput } from '../BaseInput';

type BaseInputProps = React.ComponentProps<typeof BaseInput>;

export interface Props extends BaseInputProps {
  value?: string;
}

export const TextInput: FC<Props> = (props) => {
  const { name, ...otherProps } = props;

  return <BaseInput id={name}
    name={name}
    type='text'
    {...otherProps} />;
};
