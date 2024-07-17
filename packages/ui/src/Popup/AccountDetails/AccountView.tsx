import type { FC } from 'react';
import type { IdentifiedAccount } from '@polymeshassociation/extension-core/types';

import React, { useContext } from 'react';

import { recodeAddress } from '@polymeshassociation/extension-core/utils';
import { SvgClose } from '@polymeshassociation/extension-ui/assets/images/icons';
import { PolymeshContext } from '@polymeshassociation/extension-ui/components';
import { CddStatus } from '@polymeshassociation/extension-ui/components/CddStatus';
import { InitialsAvatar } from '@polymeshassociation/extension-ui/components/InitialsAvatar';
import { Box, Flex, Hr, Icon, LabelWithCopy, StatusBadge, Text, TextEllipsis, TextOverflowEllipsis } from '@polymeshassociation/extension-ui/ui';

import { formatAmount } from '../../util/formatters';

export interface Props {
  address: string;
  selectedAccount: IdentifiedAccount | undefined;
  onClose: () => void;
}

export const AccountView: FC<Props> = ({ address,
  onClose,
  selectedAccount }) => {
  const { networkState: { ss58Format } } = useContext(PolymeshContext);

  const formatExpiry = (expiryDate: Date) => {
    return `${expiryDate.getDate()} ${expiryDate.toLocaleString('default', {
      month: 'short'
    })} ${expiryDate.getFullYear()}`;
  };

  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'red' : 'blue';
    const text = keyType === 'primary' ? 'Primary' : keyType === 'secondary' ? 'Secondary' : 'MultiSigSigner';

    return (
      selectedAccount?.did && <StatusBadge variant={color}>{text}</StatusBadge>
    );
  };

  return (
    <>
      <Flex
        justifyContent='space-between'
        m='m'
      >
        <Box>
          <Text
            color='gray1'
            variant='c1'
          >
            ACCOUNT DETAILS
          </Text>
        </Box>
        <Box>
          <Icon
            Asset={SvgClose}
            color='gray5'
            height={14}
            onClick={onClose}
            style={{ cursor: 'pointer' }}
            width={14}
          />
        </Box>
      </Flex>
      <Box
        bg='brandLightest'
        borderRadius='2'
        m='m'
        px='xs'
      >
        <Text
          color='brandMain'
          variant='b2'
        >
          <TextEllipsis size={39}>{selectedAccount?.did || ''}</TextEllipsis>
        </Text>
      </Box>
      <Box
        mb='s'
        mx='m'
      >
        <Flex
          justifyContent='space-between'
          mb='s'
        >
          <Box>
            <Text
              color='gray3'
              variant='b2m'
            >
              CDD Verification
            </Text>
          </Box>
          <Box>
            {selectedAccount?.did
              ? (
                <CddStatus
                  cdd={selectedAccount?.cdd}
                  withText
                />
              )
              : (
                'N/A'
              )}
          </Box>
        </Flex>
        <Flex
          justifyContent='space-between'
          mb='s'
        >
          <Box>
            <Text
              color='gray3'
              variant='b2m'
            >
              Date of expiry
            </Text>
          </Box>
          <Box>
            <Text
              color='gray.1'
              variant='b2m'
            >
              {selectedAccount?.cdd?.expiry
                ? formatExpiry(new Date(selectedAccount?.cdd?.expiry))
                : 'N/A'}
            </Text>
          </Box>
        </Flex>
        <Flex
          justifyContent='space-between'
          mb='s'
        >
          <Box>
            <Text
              color='gray3'
              variant='b2m'
            >
              Verified by
            </Text>
          </Box>
          <Box>
            <Text
              color='gray.1'
              variant='b2m'
            >
              {selectedAccount?.cdd?.issuer
                ? (
                  <LabelWithCopy
                    color='gray.1'
                    text={selectedAccount.cdd.issuer}
                    textSize={18}
                    textVariant='b2m'
                  />
                )
                : (
                  'N/A'
                )}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Hr />
      <Box m='m'>
        <Text
          color='gray1'
          variant='c1'
        >
          KEYS
        </Text>
      </Box>
      <Flex
        justifyContent='space-between'
        mx='m'
      >
        <InitialsAvatar name={selectedAccount?.name} />
        <Box
          ml='s'
          width='100%'
        >
          <Flex flexDirection='row'>
            <TextOverflowEllipsis
              color='gray.1'
              maxWidth='157px'
              variant='b2m'
            >
              {selectedAccount?.name}
            </TextOverflowEllipsis>
            <Box ml='s'>{renderType(selectedAccount?.keyType || '')}</Box>
          </Flex>
          <Flex
            flexDirection='row'
            justifyContent='space-between'
          >
            <LabelWithCopy
              color='gray.3'
              text={recodeAddress(address, ss58Format)}
              textSize={13}
              textVariant='b3'
            />
            <Box>
              <Text
                color='gray.1'
                variant='b3'
              >
                {formatAmount(selectedAccount?.balance?.transferrable || 0)}{' '}
                POLYX
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
