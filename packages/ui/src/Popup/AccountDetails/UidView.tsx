import { SvgEyeOffOutline, SvgEyeOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { Box, Flex, Icon, LabelWithCopy, Text } from '@polymathnetwork/extension-ui/ui';
import React, { FC } from 'react';

export interface Props {
  isHidden: boolean;
  uid: string;
  showHideUid: () => void;
}

export const UidView: FC<Props> = ({ isHidden, showHideUid, uid }) => {
  return (
    <Box
      bg={isHidden ? 'gray8' : 'warning2'}
      borderRadius='2'
      mx='m'
      p='s'
    >
      <Flex justifyContent='space-between'>
        <Text
          color='gray3'
          variant='b2m'
        >
                Your investor uID
        </Text>
        <Box>
          <Flex
            alignItems='center'
            onClick={showHideUid}
            style={{ cursor: 'pointer' }}
          >
            <Box>
              <Icon
                Asset={isHidden ? SvgEyeOutline : SvgEyeOffOutline }
                color='polyNavyBlue'
                height={22}
                style={{ cursor: 'pointer' }}
                width={22}
              />
            </Box>
            <Box mx='xs'>
              <Text
                color='polyNavyBlue'
                variant='b2m'
              >
                {isHidden ? 'Show my uID' : 'Hide my uID'}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box mt='s'>
        {isHidden && (
          <Text
            color='gray.1'
            variant='b1'
          >
            **********
          </Text>
        )}
        {!isHidden && <LabelWithCopy
          color='gray1'
          text={uid}
          textSize={39}
          textVariant='b2'
        />}
      </Box>
    </Box>
  );
};
