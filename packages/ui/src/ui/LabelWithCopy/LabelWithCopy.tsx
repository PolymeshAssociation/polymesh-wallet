import React, { FC, useState } from 'react';
import { SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextEllipsis } from '../TextEllipsis';

export interface Props {
  text: string;
  color: string;
  textSize: number;
  textVariant: 'b1m' | 'b1' | 'b2m' | 'b2' | 'b3m' | 'b3' | 'sh1' | 'c1' | 'c2' | 'c2m';
}

export const LabelWithCopy: FC<Props> = ({ color, text, textSize, textVariant }) => {
  const [hover, setHover] = useState(false);

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(true);
  };

  return (
    <Flex
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      <Box>
        <Text color={color}
          variant={textVariant}>
          <TextEllipsis size={textSize}>
            {text}
          </TextEllipsis>
        </Text>
      </Box>
      {
        hover &&
          <CopyToClipboard text={text}>
            <Box ml='xs'>
              <Icon Asset={SvgContentCopy}
                color={color}
                height={16}
                width={16}
              />
            </Box>
          </CopyToClipboard>
      }
    </Flex>
  );
};
