import { styled } from '@polymeshassociation/extension-ui/styles';

export const NetworkSelect = styled.div<{ background: string }>`
  display: flex;
  align-items: center;
  height: 24px;
  border-radius: 24px;
  padding: 0 3px 0 8px;
  background: ${(props) => props.background};
  cursor: pointer;
`;

export const DropdownIcon = styled.div<{ background: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => props.background};
`;

export const NetworkCircle = styled.span<{
  background: string;
  color: string;
  image?: string;
  size?: string;
  thickness?: string;
}>`
  display: inline-box;
  width: ${(props) => props.size || '12px'};
  height: ${(props) => props.size || '12px'};
  background: ${(props) =>
    props.image ? `url(${props.image})` : props.background};
  border: ${(props) => (props.image ? 'none' : props.thickness || '2px')} solid
    ${(props) => props.color};
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  border-radius: 50%;
  flex-shrink: 0;
`;
