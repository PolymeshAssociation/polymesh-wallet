import type { ChangeEvent, FC } from 'react';

import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { SvgAlertCircle, SvgChecklistFilled } from '@polymeshassociation/extension-ui/assets/images/icons';
import { Box, Flex, Icon, Text, TextInput } from '@polymeshassociation/extension-ui/ui';

import { NetworkLabel, NetworkLabelContainer } from './styles';

interface Props {
  defaultValue: string;
  setUrlValue: (customNetworkUrl: string) => void;
}

const rpcUrlRegex = /^(wss?):\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]+|\[[a-fA-F0-9:]+\])(:\d+)?([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export const NetworkEdit: FC<Props> = ({ defaultValue,
  setUrlValue }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.trim());
  }, []);

  const handleSetValue = useCallback(() => {
    const networkUrl = value;
    const isValidRpcUrl = rpcUrlRegex.test(networkUrl);

    if (!isValidRpcUrl) {
      toast.error(
        <Flex>
          <Icon
            Asset={SvgAlertCircle}
            color='warning1'
            height={20}
            width={20}
          />
          <Box ml='10px'>
            <Text
              color='white'
              variant='b3m'
            >
              {`${value} is not a valid url!`}
            </Text>
          </Box>
        </Flex>
      );

      return;
    }

    setUrlValue(networkUrl);
  }, [setUrlValue, value]);

  return (
    <Box
      mb='8px'
      px='16px'
    >
      <Flex>
        <NetworkLabelContainer>
          <NetworkLabel>Enter rpc url</NetworkLabel>
          <TextInput
            onChange={handleChangeValue}
            value={value}
          />
        </NetworkLabelContainer>
        <Box pt='16px'>
          <Icon
            Asset={SvgChecklistFilled}
            color='polyPink'
            height={24}
            onClick={handleSetValue}
            style={{ cursor: 'pointer' }}
            width={24}
          />
        </Box>
      </Flex>
    </Box>
  );
};
