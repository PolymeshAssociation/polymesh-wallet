import { SvgContentCopy } from '@polymathnetwork/extension-ui/assets/images/icons';
import React, { FC, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Flex } from '../Flex';
import { Box } from '../Box';
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

export const LabelWithCopy: FC<Props> = ({
  color,
  hoverColor,
  text,
  textSize,
  textVariant,
  placement,
}) => {
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

  const foreColor = hover
    ? hoverColor && hoverColor !== ''
      ? hoverColor
      : color
    : color;

  return (
    <Tooltip
      content={copied ? CopyMessage.copied : CopyMessage.deafult}
      variant="primary"
      visible={hover}
      arrow={true}
      placement={placement}
    >
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <CopyToClipboard onCopy={handleCopy} text={text}>
          <Flex
            alignItems="center"
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            style={{ cursor: 'pointer' }}
          >
            <Text color={foreColor} variant={textVariant}>
              <TextEllipsis size={textSize}>{text}</TextEllipsis>
            </Text>

            <Icon
              Asset={SvgContentCopy}
              color={foreColor}
              opacity="0.6"
              height={14}
              ml="xs"
              style={{ cursor: 'pointer' }}
              width={16}
            />
          </Flex>
        </CopyToClipboard>
      </Box>
    </Tooltip>
  );
};
