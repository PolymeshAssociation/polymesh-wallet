import React, { FC, useContext } from 'react';
import { Box, Flex, Hr, Icon, LabelWithCopy, StatusBadge, Text, TextEllipsis } from '@polymathnetwork/extension-ui/ui';
import { SvgClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { useHistory, useParams } from 'react-router';
import { PolymeshContext } from '@polymathnetwork/extension-ui/components';
import BigNumber from 'bignumber.js';
import { formatters } from '../../util';
import { CddStatus } from '@polymathnetwork/extension-ui/components/CddStatus';

interface AddressState {
  address: string;
}

export const AccountDetails: FC = () => {
  const history = useHistory();
  const { address } = useParams<AddressState>();
  const { polymeshAccounts } = useContext(PolymeshContext);

  const close = () => {
    history.push('/');
  };

  const selectedAccount = polymeshAccounts?.find((account) => (account.address === address));

  const formatExpiry = (expiryDate: Date) => {
    return `${expiryDate.getDate()} ${expiryDate.toLocaleString('default', { month: 'short' })} ${expiryDate.getFullYear()}`;
  };

  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'green' : 'blue';
    const text = keyType === 'primary' ? 'Primary' : 'Secondary';

    return (
      selectedAccount?.did && <StatusBadge variant={color}>{text}</StatusBadge>
    );
  };

  return (
    <>
      <Flex justifyContent='space-between'
        mx='s'
        my='s'>
        <Box>
          <Text color='gray.1'
            variant='c2'>
            ACCOUNT DETAILS
          </Text>
        </Box>
        <Box>
          <Icon Asset={SvgClose}
            color='gray.3'
            height={14}
            onClick={close}
            style={{ cursor: 'pointer' }}
            width={14} />
        </Box>
      </Flex>

      <Box bg='brandLightest'
        borderRadius='2'
        mt='m'
        mx='s'>
        <Text color='brandMain'
          variant='b2'>
          <TextEllipsis size={39}>
            {selectedAccount?.did || ''}
          </TextEllipsis>
        </Text>
      </Box>

      <Box mt='2'
        mx='s'>
        <Flex justifyContent='space-between'
          mb='s'>
          <Box>
            <Text color='gray.2'
              variant='b2m'>
              CDD Verification
            </Text>
          </Box>
          <Box>
            {selectedAccount?.did
              ? <CddStatus cdd={selectedAccount?.cdd}
                withText /> : 'N/A'
            }
          </Box>
        </Flex>
        <Flex justifyContent='space-between'
          mb='s'>
          <Box>
            <Text color='gray.2'
              variant='b2m'>
              Date of expiry
            </Text>
          </Box>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {selectedAccount?.cdd?.expiry ? formatExpiry(new Date(selectedAccount?.cdd?.expiry)) : 'N/A'}
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent='space-between'
          mb='s'>
          <Box>
            <Text color='gray.2'
              variant='b2m'>
              Verified by
            </Text>
          </Box>
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {selectedAccount?.cdd?.issuer &&
                <LabelWithCopy color='gray.1'
                  text={selectedAccount?.cdd?.issuer}
                  textSize={18}
                  textVariant='b2m'
                />
              }
              {!selectedAccount?.cdd?.issuer &&
                'N/A'
              }
            </Text>
          </Box>
        </Flex>
      </Box>

      <Hr />

      <Box mx='s'
        my='s'>
        <Text color='gray.1'
          variant='c2'>
            KEYS
        </Text>
      </Box>

      <Box bg='gray.5'
        mt='s'>
        <Flex justifyContent='space-between'
          mx='s'>
          <Box>
            <Box
              backgroundColor='brandLightest'
              borderRadius='50%'
              height={40}
              px='2'
              width={40}
            >
              <Flex justifyContent='center'
                pt='xs'>
                <Text color='brandMain'
                  variant='b2m'>{selectedAccount?.name?.substr(0, 1)}</Text>
              </Flex>
            </Box>
          </Box>
          <Box ml='s'
            width='100%'>
            <Flex flexDirection='row'>
              <Text color='gray.1'
                variant='b2m'>
                {selectedAccount?.name}
              </Text>
              <Box ml='s'>
                {renderType(selectedAccount?.keyType || '')}
              </Box>
            </Flex>
            <Flex
              flexDirection='row'
              justifyContent='space-between'
            >
              <LabelWithCopy color='gray.3'
                text={address}
                textSize={13}
                textVariant='b3'
              />
              <Box>
                <Text color='gray.1'
                  variant='b3'>
                  {formatters.formatAmount(new BigNumber(selectedAccount?.balance || 0), 2, true)} POLYX
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
