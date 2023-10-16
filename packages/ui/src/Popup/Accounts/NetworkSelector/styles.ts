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

export const NetworkLabelContainer = styled.label`
  margin-right: 8px;
  display: block;
  width: 100%;
`
export const NetworkLabel = styled.span`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.04em;
  opacity: 0.65;
  margin-bottom: 12px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
`
