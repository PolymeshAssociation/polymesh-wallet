import type { FC } from 'react';
import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { BoxProps } from '../Box';

import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';

import { Box } from '../Box';
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
  background: theme.colors.gradient,
  padding: theme.space.m,
  zIndex: 500
}));

export const Header: FC<HeaderProps> = (props) => {
  const { children, headerText, iconAsset, ...otherProps } = props;

  const { pathname } = useLocation();
  const history = useHistory();

  const onCancel = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <HeaderBox {...otherProps}>
      {iconAsset && (
        <>
          <Flex
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Flex
              backgroundColor='white'
              borderRadius='50%'
              height={48}
              justifyContent='center'
              px={12}
              py={12}
              width={48}
            >
              <Icon
                Asset={iconAsset}
                color='brandMain'
                height={20}
                width={20}
              />
            </Flex>
            {pathname !== '/' && (
              <Box style={{ cursor: 'pointer' }}>
                <Link onClick={onCancel}>
                  <Text
                    color='polyNavyBlue'
                    variant='b2'
                  >
                    Cancel
                  </Text>
                </Link>
              </Box>
            )}
          </Flex>
          <Box pt='m'>
            <Heading
              color='white'
              variant='h4'
            >
              {headerText}
            </Heading>
          </Box>
        </>
      )}
      {children}
    </HeaderBox>
  );
};
