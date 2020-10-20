import React, { FC, useEffect, useState } from 'react';
import { SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextEllipsis } from '../TextEllipsis';
import * as sc from './styles';

export interface Props {
  text: string;
  color: string;
  textSize: number;
  textVariant: 'b1m' | 'b1' | 'b2m' | 'b2' | 'b3m' | 'b3' | 'sh1' | 'c1' | 'c2' | 'c2m';
}

export const LabelWithCopy: FC<Props> = ({ color, text, textSize, textVariant }) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timerRef, setTimerRef] = useState(0);

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.stopPropagation) e.stopPropagation();
  };

  useEffect(() => {
    return () => {
      if (timerRef !== 0) clearTimeout(timerRef);
    };
  }, [timerRef]);

  const handleCopy = () => {
    setCopied(true);
    setTimerRef(
      setTimeout(() => {
        setCopied(false);
      }, 2000)
    );
  };

  return (
    <sc.StatusText copied={copied}>
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
            <CopyToClipboard onCopy={handleCopy}
              text={text}>
              <Box ml='xs'
                onClick={handleClick}>
                <Icon Asset={SvgContentCopy}
                  color={color}
                  height={16}
                  style={{ cursor: 'pointer' }}
                  width={16}
                />
              </Box>
            </CopyToClipboard>
        }
      </Flex>
    </sc.StatusText>
  );
};
