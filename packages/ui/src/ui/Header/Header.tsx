import styled from 'styled-components';
import { Box } from '../Box';

export const Header = styled(Box)({
  // @ts-ignore
  paddingTop: ({ theme }: { theme: any }) => theme.space.xs as string,
  paddingBottom: ({ theme }: { theme: any }) => theme.space.m as string,
  paddingLeft: ({ theme }: { theme: any }) => theme.space.s as string,
  paddingRight: ({ theme }: { theme: any }) => theme.space.s as string,
  backgroundImage: 'linear-gradient(to right, #170087, #1813E4)'
});
