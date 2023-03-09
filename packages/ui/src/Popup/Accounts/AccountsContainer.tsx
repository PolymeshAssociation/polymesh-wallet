import React, { FC, useContext, useState, KeyboardEvent } from 'react';
import { IdentifiedAccount } from '@polymeshassociation/extension-core/types';
import {
  SvgCheck,
  SvgPencilOutline,
  SvgWindowClose,
} from '@polymeshassociation/extension-ui/assets/images/icons';
import {
  ActionContext,
  PolymeshContext,
} from '@polymeshassociation/extension-ui/components';
import { CddStatus } from '@polymeshassociation/extension-ui/components/CddStatus';
import { renameIdentity } from '@polymeshassociation/extension-ui/messaging';

import {
  Box,
  Flex,
  Icon,
  LabelWithCopy,
  Text,
  TextInput,
  TextOverflowEllipsis,
} from '../../ui';
import { AccountView } from './AccountView';

export interface Props {
  did: string;
  selectedAccount: string;
  accounts: IdentifiedAccount[];
  headerColor: string;
}

export const AccountsContainer: FC<Props> = ({
  accounts,
  did,
  selectedAccount,
}) => {
  const currentAccount = accounts.find((acc) => acc.did === did);

  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAlias, setNewAlias] = useState(
    currentAccount?.didAlias ? currentAccount.didAlias : ''
  );
  const onAction = useContext(ActionContext);
  const {
    networkState: { selected: network },
  } = useContext(PolymeshContext);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveAlias();
    else if (e.key === 'Escape') stopEditAlias();
  };

  const editAlias = () => {
    setHover(false);
    setIsEditing(true);
  };

  const stopEditAlias = () => setIsEditing(false);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlias(e.target.value);
  };

  const saveAlias = async () => {
    if (!currentAccount?.did || !network) {
      return;
    }

    await renameIdentity(network, currentAccount?.did, newAlias);
    stopEditAlias();
    onAction();
  };

  const mouseEnter = () => setHover(true);

  const mouseLeave = () => setHover(false);

  const renderContainerHeader = (isAssigned: boolean) => {
    if (isAssigned) {
      return (
        <Box bg="polyPinkLight" borderRadius="2" mt="xs" mx="s" px="s">
          {isEditing && (
            <Flex py="xxs">
              <TextInput
                autoFocus
                defaultValue={currentAccount?.didAlias}
                onChange={handleAliasChange}
                onKeyDown={handleKeyDown}
                placeholder="Your Polymesh Account"
                style={{ height: '18px' }}
                tight
                value={newAlias}
              />
              <Icon
                Asset={SvgCheck}
                color="polyPink"
                height={20}
                onClick={saveAlias}
                style={{ cursor: 'pointer' }}
                width={20}
              />
              <Icon
                Asset={SvgWindowClose}
                color="polyPink"
                height={20}
                onClick={stopEditAlias}
                style={{ cursor: 'pointer' }}
                width={20}
              />
            </Flex>
          )}
          {!isEditing && (
            <Flex
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            >
              <Flex alignItems="center">
                {!!currentAccount?.didAlias && (
                  <TextOverflowEllipsis
                    color="polyIndigo"
                    maxWidth="140px"
                    variant="b3m"
                  >
                    {currentAccount.didAlias}
                  </TextOverflowEllipsis>
                )}
                <Box {...(!!currentAccount?.didAlias && { ml: 's' })}>
                  <LabelWithCopy
                    color="polyIndigo"
                    text={did}
                    textSize={currentAccount?.didAlias ? 20 : 30}
                    textVariant="b3m"
                    placement="top"
                  />
                </Box>
              </Flex>
              <Flex>
                <Flex mr="xs">
                  <Icon
                    Asset={SvgPencilOutline}
                    color={hover ? 'polyPink' : 'polyPinkLight'}
                    height={16}
                    onClick={editAlias}
                    style={{ cursor: 'pointer' }}
                    width={16}
                  />
                </Flex>
                <CddStatus cdd={accounts[0].cdd} />
              </Flex>
            </Flex>
          )}
        </Box>
      );
    } else {
      return (
        <Box mx="s">
          <Text color="gray1" variant="b2m">
            Unassigned keys
          </Text>
        </Box>
      );
    }
  };

  const renderAccounts = () => {
    return (
      <>
        {accounts
          .sort((a) => (a.keyType === 'primary' ? -1 : 1))
          .map((account: IdentifiedAccount, index) => {
            return (
              <AccountView
                account={account}
                isSelected={account.address === selectedAccount}
                key={index}
              />
            );
          })}
      </>
    );
  };

  return (
    <Box bg="white" borderRadius="3" boxShadow="3" m="m" pb="xs" pt="xs">
      {renderContainerHeader(accounts[0].did !== undefined)}
      {renderAccounts()}
    </Box>
  );
};
