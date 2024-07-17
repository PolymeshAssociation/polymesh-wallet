import type { FC } from 'react';

import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { SvgContentCopy } from '@polymeshassociation/extension-ui/assets/images/icons';

import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextEllipsis } from '../TextEllipsis';
import { Tooltip } from '../Tooltip';

export interface Props {
  text: string;
  color: string;
  hoverColor?: string;
  textSize: number;
  textVariant:
  | 'b1m'
  | 'b1'
  | 'b2m'
  | 'b2'
  | 'b3m'
  | 'b3'
  | 'sh1'
  | 'c1'
  | 'c2'
  | 'c2m';
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

enum CopyMessage {
  deafult = 'Copy to clipboard',
  copied = 'Copied',
}

export const LabelWithCopy: FC<Props> = ({ color,
  hoverColor,
  placement,
  text,
  textSize,
  textVariant }) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setTimeout>>();

  const onMouseOver = useCallback(() => {
    setHover(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setHover(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef) {
        clearTimeout(timerRef);
      }
    };
  }, [timerRef]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimerRef(
      setTimeout(() => {
        setCopied(false);
      }, 2000)
    );
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const foreColor = hover
    ? hoverColor && hoverColor !== ''
      ? hoverColor
      : color
    : color;

  return (
    <Flex>
      <Tooltip
        arrow={true}
        content={copied ? CopyMessage.copied : CopyMessage.deafult}
        placement={placement}
        variant='primary'
        visible={hover}
      >
        <Box onClick={handleClick}>
          <CopyToClipboard
            onCopy={handleCopy}
            text={text}
          >
            <Flex
              alignItems='center'
              onMouseOut={onMouseOut}
              onMouseOver={onMouseOver}
              style={{ cursor: 'pointer' }}
            >
              <Text
                color={foreColor}
                variant={textVariant}
              >
                <TextEllipsis size={textSize}>{text}</TextEllipsis>
              </Text>
              <Icon
                Asset={SvgContentCopy}
                color={foreColor}
                height={14}
                ml='xs'
                opacity='0.6'
                style={{ cursor: 'pointer' }}
                width={16}
              />
            </Flex>
          </CopyToClipboard>
        </Box>
      </Tooltip>
    </Flex>
  );
};
