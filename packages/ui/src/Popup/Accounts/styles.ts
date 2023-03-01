import { styled } from '@polymeshassociation/extension-ui/styles';

export const AccountViewGrid = styled.div`
  display: grid;
  grid-template-areas: 'avatar account-info options';
  gap: 10px;
  grid-template-columns: 43px auto 26px;
  grid-template-rows: 56px;
  align-items: center;
  justify-items: stretch;
`;

export const AccountInfoGrid = styled.div`
  display: grid;
  grid-template-areas:
    'name-edit name-edit name-edit type'
    'name      name      name      type'
    'address   address   balance   balance';
  grid-template-columns: repeat(3, 1fr) 110px;
`;

export const UnassignedAccountHoverGrid = styled.div`
  display: grid;
  grid-template-areas:
    'name-edit name-edit name-edit assign'
    'name      name      name      assign'
    'address   address   .         assign';
  grid-template-columns: repeat(3, 1fr) 110px;
`;

export const GridItem = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
`;
