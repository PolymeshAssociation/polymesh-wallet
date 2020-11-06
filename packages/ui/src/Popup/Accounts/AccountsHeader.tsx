import React, { FC, useContext, useState } from 'react';
import { Text, Box, TextEllipsis, TextInput, Flex, Icon, Heading, LabelWithCopy } from '../../ui';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgPencilOutline, SvgCheck, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { formatters } from '../../util';
import BigNumber from 'bignumber.js';
import { useHistory } from 'react-router';
import { renameIdentity } from '@polymathnetwork/extension-ui/messaging';
import { AccountType, ActionContext, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { CddStatus } from '@polymathnetwork/extension-ui/components/CddStatus';

export interface Props {
  account: IdentifiedAccount;
  details?: boolean;
}

export const AccountsHeader: FC<Props> = ({ account, details = true }) => {
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [hover, setHover] = useState(false);
  const { network } = useContext(PolymeshContext);
  const onAction = useContext(ActionContext);

  const showAccountDetails = () => {
    history.push(`/account/details/${account?.address}`);
  };

  const startEdit = () => {
    setHover(false);
    setNewAlias(account.didAlias);
    setEditing(true);
  };

  const stopEdit = () => {
    setEditing(false);
  };

  const mouseEnter = () => setHover(true);

  const mouseLeave = () => setHover(false);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlias(e.target.value);
  };

  const saveAlias = async () => {
    account && account.did && network && await renameIdentity(network as NetworkName, account.did, newAlias);
    stopEdit();
    onAction();
  };

  return (
    <>
      {
        account?.did &&
        <>
          {!editing &&
            <Flex alignItems='center'
              mb='xs'
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}>
              <Text color='gray.0'
                variant='b1m'>
                {account.didAlias ? account.didAlias : '[Your Polymesh ID]'}
              </Text>
              {hover &&
                <Flex ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color='gray.0'
                    height={16}
                    onClick={startEdit}
                    style={{ cursor: 'pointer' }}
                    width={16} />
                </Flex>
              }
            </Flex>
          }
          {editing &&
            <Flex mb='xs'>
              <TextInput defaultValue={name}
                onChange={handleAliasChange}
                tight
                value={newAlias} />
              <Box onClick={saveAlias}
                style={{ cursor: 'pointer' }}>
                <Icon Asset={SvgCheck}
                  color='gray.0'
                  height={24}
                  width={24} />
              </Box>
              <Box onClick={stopEdit}
                style={{ cursor: 'pointer' }}>
                <Icon Asset={SvgWindowClose}
                  color='gray.0'
                  height={24}
                  width={24} />
              </Box>
            </Flex>
          }
          <Box bg='brandLightest'
            borderRadius='2'>
            {account && (
              <Flex flexDirection='row'
                justifyContent='space-between'
                mx='1'>
                <Flex>
                  <Text color='gray.2'
                    variant='c2'>
                    <TextEllipsis size={29}>{account?.did}</TextEllipsis>
                  </Text>
                </Flex>
                <CddStatus cdd={account.cdd}
                  withText />
              </Flex>
            )}
          </Box>
        </>
      }
      {
        !account?.did &&
    <Text color='brandLighter'
      variant='b2m'>Unassigned key</Text>
      }
      <Flex alignItems='center'
        flexDirection='row'
        mt='s'>
        <Box>
          <Text color='gray.0'
            variant='b1m'>
            {account?.name}
          </Text>
        </Box>
        <Box ml='s'>
          {account?.did && <AccountType keyType={account?.keyType}
            large={true} />}
        </Box>
      </Flex>
      <Flex>
        <LabelWithCopy color='brandLightest'
          hoverColor='brandLighter'
          text={account?.address || ''}
          textSize={30}
          textVariant='b3'
        />
      </Flex>
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
          borderWidth={2}
          onClick={showAccountDetails}
          style={{ cursor: 'pointer' }}>
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
};
