import React, { FC, ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Text, Flex, Box, Icon, TextInput } from "@polymeshassociation/extension-ui/ui"
import { SvgChecklistFilled, SvgAlertCircle } from '@polymeshassociation/extension-ui/assets/images/icons';
import { NetworkLabelContainer, NetworkLabel } from './styles';

interface Props {
  defaultValue: string;
  setUrlValue: (customNetworkUrl: string) => void;
}

const rpcUrlRegex = /^(wss?):\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]+|\[[a-fA-F0-9:]+\])(:\d+)?([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export const NetworkEdit: FC<Props> = ({
  defaultValue,
  setUrlValue,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.trim());
  };

  const handleSetValue = () => {
    const networkUrl = value;
    const isValidRpcUrl = rpcUrlRegex.test(networkUrl);

    if (!isValidRpcUrl) {
      toast.error(
        <Flex>
          <Icon
            Asset={SvgAlertCircle}
            color="warning1"
            height={20}
            width={20}
          />
          <Box ml="10px">
            <Text color="white" variant="b3m">
              {`${value} is not a valid url!`}
            </Text>
          </Box>
        </Flex>
      );
      return;
    }

    setUrlValue(networkUrl);
  };

  return (
    <Box px="16px" mb="8px">
      <Flex>
        <NetworkLabelContainer>
          <NetworkLabel>Enter rpc url</NetworkLabel>
          <TextInput value={value} onChange={handleChangeValue} />
        </NetworkLabelContainer>

        <Box pt="16px">
          <Icon
            Asset={SvgChecklistFilled}
            style={{ cursor: 'pointer' }}
            onClick={() => handleSetValue()}
            color="polyPink"
            height={24}
            width={24}
          />
        </Box>
      </Flex>
    </Box>
  );
};
