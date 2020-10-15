import styled, { keyframes } from 'styled-components';

import { LoadingProps } from './types';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

const mask = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Wrapper = styled.div<LoadingProps>`
  position: relative;
  width: ${({ small }) => (small ? '32px' : '64px')};
  height: ${({ small }) => (small ? '32px' : '64px')};
  animation: 1s ${spin} infinite cubic-bezier(0.255, 0.2, 0.315, 0.455);
  span,
  span:before {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ small }) => (small ? '16px' : '32px')};
    height: ${({ small }) => (small ? '32px' : '64px')};
    overflow: hidden;
    box-sizing: border-box;
    transform-origin: 100% 50%;
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
  }
  span:before {
    content: '';
    border-width: ${({ small }) => (small ? '4px' : '5px')};
    border-color: ${({ theme }) => theme.colors.primary};
    border-style: solid;
    border-right-color: transparent;
    animation: 4s ${mask} infinite linear;
  }
  span:nth-child(1) {
    transform: rotate(180deg);
  }
  span:nth-child(2) {
    transform: rotate(360deg);
    &:before {
      animation-delay: 1s;
    }
  }
`;
