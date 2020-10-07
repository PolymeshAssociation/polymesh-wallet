import React, { FC } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { Box, BoxProps } from '../Box';
import { Flex } from '../Flex';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { Link } from '../Link';
import { Text } from '../Text';

export interface HeaderProps extends BoxProps {
  iconAsset?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  headerText?: string;
}

const HeaderBox = styled(Box)({
  // @ts-ignore
  paddingTop: ({ theme }: { theme: any }) => theme.space.xs as string,
  paddingBottom: ({ theme }: { theme: any }) => theme.space.m as string,
  paddingLeft: ({ theme }: { theme: any }) => theme.space.s as string,
  paddingRight: ({ theme }: { theme: any }) => theme.space.s as string,
  backgroundImage: 'linear-gradient(to right, #170087, #1348E4)'
});

export const Header: FC<HeaderProps> = (props) => {
  const { children, headerText, iconAsset, ...otherProps } = props;

  const { pathname } = useLocation();
  const history = useHistory();

  const onCancel = () => {
    history.push('/');
  };

  return (
    <HeaderBox {...otherProps}>
      {iconAsset &&
        <Box pt='m'>
          <Flex alignItems='flex-start'
            justifyContent='space-between'>
            <Box
              backgroundColor='brandLightest'
              borderRadius='50%'
              height={48}
              px={14}
              py={9}
              width={48}
            >
              <Icon Asset={iconAsset}
                color='brandMain'
                height={20}
                width={20} />
            </Box>
            {pathname !== '/' &&
              <Box style={{ cursor: 'pointer' }}>
                <Link onClick={onCancel}>
                  <Text color='brandLighter'
                    variant='b1'>Cancel</Text>
                </Link>
              </Box>
            }
          </Flex>
          <Box pt='m'
            width={220}>
            <Heading color='white'
              variant='h5'>
              {headerText}
            </Heading>
          </Box>
        </Box>
      }
      {children}
    </HeaderBox>
  );
};
