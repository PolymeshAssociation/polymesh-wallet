import { LabelWithCopy } from '@polymathnetwork/extension-ui/ui';
import { Box, Flex, Icon, icons, Text, Tooltip } from '@polymathnetwork/polymesh-ui';
import React, { FC } from 'react';

export interface Props {
  isHidden: boolean;
  uid: string;
  showHideUid: () => void;
}

export const UidView: FC<Props> = ({ isHidden, showHideUid, uid }) => {
  return (
    <Box bg={isHidden ? 'gray.4' : 'yellow.1'}
      borderRadius='2'
      mt='m'
      mx='s'
      p='s'>
      <Flex justifyContent='space-between'>
        <Box>
          <Flex alignItems='center'>
            <Box>
              <Text color='gray.2'
                variant='b2m'>
                Your investor uID
              </Text>
            </Box>
            <Box mx='xs'>
              <Tooltip content={<Text variant='c2'>Your investor uID</Text>}
                placement='bottom'
                variant='secondary'>
                <Icon Asset={icons.SvgInfo}
                  color='brandMain'
                  height={14}
                  style={{ cursor: 'pointer' }}
                  width={14} />
              </Tooltip>
            </Box>
          </Flex>
        </Box>
        <Box>
          <Flex alignItems='center'
            onClick={showHideUid}
            style={{ cursor: 'pointer' }}>
            <Box>
              <Icon
                Asset={isHidden ? icons.SvgEmailOpenOutline : icons.SvgLockOutline}
                color='brandMain'
                height={21}
                style={{ cursor: 'pointer' }}
                width={21}
              />
            </Box>
            <Box mx='xs'>
              <Text color='brandMain'
                variant='b2m'>
                {isHidden ? 'Show my uID' : 'Hide my uID'}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box mt='s'>
        {isHidden && (
          <Text color='gray.1'
            variant='b1'>
            **********
          </Text>
        )}
        {!isHidden && <LabelWithCopy color='brandMain'
          text={uid}
          textSize={39}
          textVariant='b2' />
        }
      </Box>
    </Box>
  );
};
