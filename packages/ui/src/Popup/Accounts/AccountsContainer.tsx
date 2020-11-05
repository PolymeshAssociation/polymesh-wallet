import React, { FC, useContext, useState } from 'react';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { Box, Text, Flex, Icon, LabelWithCopy, TextInput } from '../../ui';
import { SvgAlertCircle, SvgCheck, SvgCheckboxMarkedCircle, SvgPencilOutline, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import { AccountView } from './AccountView';
import { renameIdentity } from '@polymathnetwork/extension-ui/messaging';
import { ActionContext, PolymeshContext } from '@polymathnetwork/extension-ui/components';
import { CddStatus } from '@polymathnetwork/extension-ui/components/CddStatus';

export interface Props {
  did: string;
  selectedAccount: string;
  accounts: IdentifiedAccount[];
  headerColor: string;
}

export const AccountsContainer: FC<Props> = ({ accounts, did, headerColor, selectedAccount }) => {
  const currentAccount = accounts.find((acc) => acc.did === did);

  const [isEditing, setIsEditing] = useState(false);
  const [newAlias, setNewAlias] = useState(currentAccount?.didAlias ? currentAccount.didAlias : '');
  const onAction = useContext(ActionContext);
  const { network } = useContext(PolymeshContext);

  const editAlias = () => setIsEditing(true);

  const stopEditAlias = () => setIsEditing(false);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlias(e.target.value);
  };

  const saveAlias = async () => {
    if (!currentAccount?.did || !network) { return; }

    await renameIdentity(network as NetworkName, currentAccount?.did, newAlias);
    stopEditAlias();
    onAction();
  };

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
                placeholder='Your Polymesh ID'
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
              justifyContent='space-between'>
              <Flex alignItems='center'>
                { currentAccount?.didAlias && currentAccount.didAlias !== '' &&
                  <Text color='brandMain'
                    variant='c2'>{currentAccount.didAlias}</Text>
                }
                <Box ml='xs'>
                  <LabelWithCopy color='brandMain'
                    text={did}
                    textSize={currentAccount?.didAlias && currentAccount.didAlias !== '' ? 30 - currentAccount.didAlias.length : 30}
                    textVariant='c2'
                  />
                </Box>
              </Flex>
              <Flex>
                <Flex mr='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color='brandMain'
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
        {accounts.map((account: IdentifiedAccount, index) => {
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
    <Box borderRadius='2'
      boxShadow='3'
      m='s'
      pb='xs'
      pt='xs'>
      {renderContainerHeader(accounts[0].did !== undefined)}
      {renderAccounts()}
    </Box>
  );
};
