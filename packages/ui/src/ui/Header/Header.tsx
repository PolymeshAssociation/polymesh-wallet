import { ThemeProps } from '@polymathnetwork/extension-ui/types';
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

const HeaderBox = styled(Box)(({ theme }: ThemeProps) => ({
  padding: `${theme.space.xs} ${theme.space.s} ${theme.space.m}`,
  background: theme.colors.gradient,
  zIndex: 500
}));

export const Header: FC<HeaderProps> = (props) => {
  const { children, headerText, iconAsset, ...otherProps } = props;

  const { pathname } = useLocation();
  const history = useHistory();

  const onCancel = () => {
    history.push('/');
  };

  return (
    <HeaderBox {...otherProps}>
      {iconAsset && (
        <Box pt='m'>
          <Flex alignItems='flex-start'
            justifyContent='space-between'>
            <Box backgroundColor='brandLightest'
              borderRadius='50%'
              height={48}
              px={12}
              py={12}
              width={48}>
              <Icon Asset={iconAsset}
                color='brandMain'
                height={24}
                width={24} />
            </Box>
            {pathname !== '/' && (
              <Box style={{ cursor: 'pointer' }}>
                <Link onClick={onCancel}>
                  <Text color='brandLighter'
                    variant='b1'>
                    Cancel
                  </Text>
                </Link>
              </Box>
            )}
          </Flex>
          <Box pt='m'>
            <Heading color='white'
              variant='h5'>
              {headerText}
            </Heading>
          </Box>
        </Box>
      )}
      {children}
    </HeaderBox>
  );
};
