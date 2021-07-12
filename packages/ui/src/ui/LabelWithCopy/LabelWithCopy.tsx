import { CopyableText, Flex, Text } from '@polymathnetwork/polymesh-ui';
import React, { FC, useState } from 'react';

import { TextEllipsis } from '../TextEllipsis';
import * as sc from './styles';

export interface Props {
  text: string;
  color: string;
  hoverColor?: string;
  textSize: number;
  textVariant: | 'b1m'
  | 'b1'
  | 'b2m'
  | 'b2'
  | 'b3m'
  | 'b3'
  | 'sh1'
  | 'c1'
  | 'c2';
}

export const LabelWithCopy: FC<Props> = ({ color, hoverColor, text, textSize, textVariant }) => {
  const [hover, setHover] = useState(false);

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.stopPropagation) e.stopPropagation();
  };

  const foreColor = hover ? hoverColor && hoverColor !== '' ? hoverColor : color : color;

  return (
    <sc.StatusText>
      <Flex alignItems='center'
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
      >
        <Text color={foreColor}
          variant={textVariant}
        >
          <TextEllipsis size={textSize}>
            {text}
          </TextEllipsis>
        </Text>
        <Flex height={24}
          ml='xs'
          onClick={handleClick}>
          <Text
            style={{ opacity: hover ? '1' : '0' }}
            width={16}
          >
            <CopyableText color={foreColor}
              copyText={text} />
          </Text>
        </Flex>
      </Flex>
    </sc.StatusText>
  );
};
