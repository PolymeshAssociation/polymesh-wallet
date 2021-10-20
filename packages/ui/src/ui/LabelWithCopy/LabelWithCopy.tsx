import { SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { FC, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
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

  useEffect(() => {
    return () => {
      if (timerRef) clearTimeout(timerRef);
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

  const foreColor = hover ? (hoverColor && hoverColor !== '' ? hoverColor : color) : color;

  return (
    <sc.StatusText copied={copied}>
      <CopyToClipboard onCopy={handleCopy} text={text}>
        <Flex alignItems='center' style={{ cursor: 'pointer' }} onMouseOut={onMouseOut} onMouseOver={onMouseOver}>
          <Tooltip content='copy to clipboard'>
            <Flex>
              <Text color={foreColor} variant={textVariant}>
                <TextEllipsis size={textSize}>{text}</TextEllipsis>
              </Text>

              <Icon
                Asset={SvgContentCopy}
                color={foreColor}
                height={16}
                ml='xs'
                style={{ cursor: 'pointer' }}
                width={16}
              />
            </Flex>
          </Tooltip>
        </Flex>
      </CopyToClipboard>
    </sc.StatusText>
  );
};
