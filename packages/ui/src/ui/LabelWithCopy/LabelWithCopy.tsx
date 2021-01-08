import React, { FC, useEffect, useState } from 'react';
import { SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextEllipsis } from '../TextEllipsis';
import * as sc from './styles';

export interface Props {
  text: string;
  color: string;
  hoverColor?: string;
  textSize: number;
  textVariant: 'b1m' | 'b1' | 'b2m' | 'b2' | 'b3m' | 'b3' | 'sh1' | 'c1' | 'c2' | 'c2m';
}

export const LabelWithCopy: FC<Props> = ({ color, hoverColor, text, textSize, textVariant }) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setTimeout>>();

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.stopPropagation) e.stopPropagation();
  };

  useEffect(() => {
    return () => {
      if (!!timerRef) clearTimeout(timerRef);
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

  const foreColor = hover ? hoverColor && hoverColor !== '' ? hoverColor : color : color;

  return (
    <sc.StatusText copied={copied}>
      <Flex alignItems='center'
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
      >
        <Text color={foreColor}
          variant={textVariant}>
          <TextEllipsis size={textSize}>
            {text}
          </TextEllipsis>
        </Text>
        <CopyToClipboard onCopy={handleCopy}
          text={text}>
          <Flex height={24}
            ml='xs'
            onClick={handleClick}>
            <Icon Asset={SvgContentCopy}
              color={foreColor}
              height={16}
              opacity={hover ? 1 : 0}
              style={{ cursor: 'pointer' }}
              width={16}
            />
          </Flex>
        </CopyToClipboard>
      </Flex>
    </sc.StatusText>
  );
};
