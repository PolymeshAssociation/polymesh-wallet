import React from 'react';
import { Text, Box, TextEllipsis, Flex, Icon, Heading, LabelWithCopy } from '../../ui';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { SvgCheckboxMarkedCircle, SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import { formatters } from '../../util';
import BigNumber from 'bignumber.js';

type Props = {
  account: IdentifiedAccount;
  details?: boolean;
}

export default function AccountsHeader ({ account, details = true }: Props): React.ReactElement<Props> {
  const renderStatus = (isVerified: boolean) => {
    const color = isVerified ? 'success' : 'alert';
    const statusText = isVerified ? 'Verified' : 'Not verified';
    const iconAsset = isVerified ? SvgCheckboxMarkedCircle : SvgAlertCircle;

    return (
      <Flex flexDirection='row'>
        <Box mr='1'>
          <Icon Asset={iconAsset}
            color={color}
            height={14}
            width={14} />
        </Box>
        <Box>
          <Text color={color}
            variant='b3m'>
            {statusText}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <>
      {
        account?.did &&
  <Box bg='brandLightest'
    borderRadius='2'>
    {account && (
      <Flex flexDirection='row'
        justifyContent='space-between'
        mx='1'>
        <Flex flexDirection='row'>
          {
            account.didAlias &&
            <Box mr='1'>
              <Text color='brandMain'
                variant='c2m'>
                Did Label
              </Text>
            </Box>
          }
          <Text color='gray.2'
            variant='c2'>
            <TextEllipsis size={29}>{account?.did}</TextEllipsis>
          </Text>
        </Flex>
        {renderStatus(account.cdd !== undefined)}
      </Flex>
    )}
  </Box>
      }
      {
        !account?.did &&
    <Text color='brandLighter'
      variant='b2m'>Unassigned key</Text>
      }
      <Flex flexDirection='row'
        mt='s'>
        <Text color='gray.0'
          variant='b1m'>
          {account?.name}
        </Text>
      </Flex>
      <Box>
        <LabelWithCopy color='gray.0'
          text={account?.address || ''}
          textSize={30}
          textVariant='b3'
        />
      </Box>
      <Flex alignItems='flex-end'
        flexDirection='row'
        mt='1'>
        <Heading color='gray.0'
          variant='h5'>
          {formatters.formatAmount(new BigNumber(account?.balance || 0), 2, true)}
        </Heading>
        <Box ml='s'>
          <Text color='gray.0'
            variant='b2'>
      POLYX
          </Text>
        </Box>
      </Flex>
      {details && <Box mt='m'>
        <Box borderColor='gray.0'
          borderRadius='3'
          borderStyle='solid'
          borderWidth={2}>
          <Flex alignItems='center'
            height={32}
            justifyContent='center'>
            <Text color='gray.0'
              variant='b2m'>
        View details
            </Text>
          </Flex>
        </Box>
      </Box> }
    </>
  );
}
