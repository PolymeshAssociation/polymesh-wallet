import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { SvgCheck, SvgPencilOutline, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { ActionContext, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { CddStatus } from '@polymathnetwork/extension-ui/components/CddStatus';
import { renameIdentity } from '@polymathnetwork/extension-ui/messaging';
import React, { FC, useContext, useState } from 'react';

import { Box, Flex, Icon, LabelWithCopy, Text, TextInput, TextOverflowEllipsis } from '../../ui';
import { AccountView } from './AccountView';

export interface Props {
  did: string;
  selectedAccount: string;
  accounts: IdentifiedAccount[];
  headerColor: string;
}

export const AccountsContainer: FC<Props> = ({ accounts, did, headerColor, selectedAccount }) => {
  const currentAccount = accounts.find((acc) => acc.did === did);

  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAlias, setNewAlias] = useState(currentAccount?.didAlias ? currentAccount.didAlias : '');
  const onAction = useContext(ActionContext);
  const { networkState: { selected: network } } = useContext(PolymeshContext);

  const editAlias = () => {
    setHover(false);
    setIsEditing(true);
  };

  const stopEditAlias = () => setIsEditing(false);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlias(e.target.value);
  };

  const saveAlias = async () => {
    if (!currentAccount?.did || !network) { return; }

    await renameIdentity(network, currentAccount?.did, newAlias);
    stopEditAlias();
    onAction();
  };

  const mouseEnter = () => setHover(true);

  const mouseLeave = () => setHover(false);

  const renderContainerHeader = (isAssigned: boolean) => {
    if (isAssigned) {
      return (
        <Box bg={headerColor}
          borderRadius='2'
          mt='xs'
          mx='s'
          px='s'>
          { isEditing &&
            <Flex py='xxs'>
              <TextInput defaultValue={currentAccount?.didAlias}
                onChange={handleAliasChange}
                placeholder='Your Polymesh Account'
                tight
                value={newAlias} />
              <Icon Asset={SvgCheck}
                color='brandMain'
                height={20}
                onClick={saveAlias}
                style={{ cursor: 'pointer' }}
                width={20} />
              <Icon Asset={SvgWindowClose}
                color='brandMain'
                height={20}
                onClick={stopEditAlias}
                style={{ cursor: 'pointer' }}
                width={20} />
            </Flex>
          }
          { !isEditing &&
            <Flex alignItems='center'
              flexDirection='row'
              justifyContent='space-between'
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}>
              <Flex alignItems='center'>
                { !!currentAccount?.didAlias &&
                  <TextOverflowEllipsis color='brandMain'
                    maxWidth='140px'
                    variant='c2'>
                    {currentAccount.didAlias}
                  </TextOverflowEllipsis>
                }
                <Box {...(!!currentAccount?.didAlias && { ml: 's' })}>
                  <LabelWithCopy color='brandMain'
                    text={did}
                    textSize={currentAccount?.didAlias ? 20 : 30}
                    textVariant='c2'
                  />
                </Box>
              </Flex>
              <Flex>
                <Flex mr='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color={hover ? 'brandMain' : headerColor}
                    height={16}
                    onClick={editAlias}
                    style={{ cursor: 'pointer' }}
                    width={16} />
                </Flex>
                <CddStatus cdd={accounts[0].cdd} />
              </Flex>
            </Flex>
          }
        </Box>
      );
    } else {
      return (
        <Box mx='xs'>
          <Text color='gray.1'
            variant='c2'>Unassigned keys</Text>
        </Box>
      );
    }
  };

  const renderAccounts = () => {
    return (
      <>
        {accounts.sort((a) => a.keyType === 'primary' ? -1 : 1).map((account: IdentifiedAccount, index) => {
          return (
            <AccountView account={account}
              isSelected={account.address === selectedAccount}
              key={index}
            />
          );
        })}
      </>
    );
  };

  return (
    <Box bg='white'
      borderRadius='2'
      boxShadow='3'
      m='s'
      pb='xs'
      pt='xs'>
      {renderContainerHeader(accounts[0].did !== undefined)}
      {renderAccounts()}
    </Box>
  );
};
