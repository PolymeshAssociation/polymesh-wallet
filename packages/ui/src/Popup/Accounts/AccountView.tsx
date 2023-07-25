import { networkLinks } from '@polymeshassociation/extension-core/constants';
import { IdentifiedAccount } from '@polymeshassociation/extension-core/types';
import { recodeAddress } from '@polymeshassociation/extension-core/utils';
import {
  SvgCheck,
  SvgDotsVertical,
  SvgPencilOutline,
} from '@polymeshassociation/extension-ui/assets/images/icons';
import { InitialsAvatar } from '@polymeshassociation/extension-ui/components/InitialsAvatar';
import { Option } from '@polymeshassociation/extension-ui/components/OptionSelector/types';
import React, { FC, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AccountContext,
  AccountType,
  ActionContext,
  OptionSelector,
  PolymeshContext,
} from '../../components';
import { editAccount, setPolySelectedAccount } from '../../messaging';
import {
  Box,
  ButtonSmall,
  Flex,
  Icon,
  LabelWithCopy,
  Text,
  TextOverflowEllipsis,
} from '../../ui';
import { formatAmount } from '../../util/formatters';
import { NameEdit } from './NameEdit';
import {
  AccountInfoGrid,
  AccountViewGrid,
  GridItem,
  UnassignedAccountHoverGrid,
} from './styles';

export interface Props {
  account: IdentifiedAccount;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({ account, isSelected }) => {
  const { address, balance, did, keyType, name } = account;

  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);

  const history = useHistory();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [hover, setHover] = useState(false);
  const [nameHover, setNameHover] = useState(false);
  const {
    networkState: { selected: network, ss58Format },
  } = useContext(PolymeshContext);

  const getMenuItems = (address: string): Option[] => {
    const account = accounts.find((_account) => _account.address === address);
    const isLedgerAccount =
      account?.isHardware && account.hardwareType === 'ledger';
    const menuItems = [{ label: 'Forget account', value: 'forget' }];

    return [
      {
        menu: isLedgerAccount
          ? menuItems
          : [{ label: 'Export account', value: 'export' }, ...menuItems],
      },
    ];
  };

  const handleMenuClick = (address: string, action: string) => {
    switch (action) {
      case 'export':
        return history.push(`/account/export/${address}`);
      case 'forget':
        return history.push(`/account/forget/${address}`);
    }
  };

  const cancelEditing = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    setNewName(name);
    setIsEditing(false);
    if (e.stopPropagation) e.stopPropagation();
  };

  const editName = (e: React.MouseEvent<HTMLElement>) => {
    setIsEditing(true);
    if (e.stopPropagation) e.stopPropagation();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const save = async (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    if (e.stopPropagation) e.stopPropagation();
    await editAccount(address || '', newName || '');
    onAction();
    setIsEditing(false);
  };

  const mouseEnter = () => {
    setHover(true);
  };

  const mouseLeave = () => {
    setHover(false);
  };

  const nameMouseEnter = () => {
    setNameHover(true);
  };

  const nameMouseLeave = () => {
    setNameHover(false);
  };

  const selectAccount = async () => {
    if (address && !isEditing) {
      await setPolySelectedAccount(address);
      onAction();
    }
  };

  const renderAccountInfo = () => {
    return (
      <AccountInfoGrid>
        {isEditing && (
          <GridItem area="name-edit">
            <NameEdit
              newName={newName}
              onCancel={cancelEditing}
              onChange={handleNameChange}
              onSave={save}
            />
          </GridItem>
        )}
        {!isEditing && (
          <GridItem area="name">
            <Flex
              flexDirection="row"
              minWidth="100px"
              onMouseEnter={nameMouseEnter}
              onMouseLeave={nameMouseLeave}
            >
              <TextOverflowEllipsis color="gray.1" variant="b2m">
                {name}
              </TextOverflowEllipsis>
              <Flex ml="xs">
                <Icon
                  Asset={SvgPencilOutline}
                  color={nameHover ? 'gray.2' : 'transparent'}
                  height={16}
                  onClick={editName}
                  style={{ cursor: 'pointer' }}
                  width={16}
                />
              </Flex>
            </Flex>
          </GridItem>
        )}
        <GridItem area="type">
          <Flex height="100%" justifyContent="flex-end">
            {did && <AccountType keyType={keyType} />}
          </Flex>
        </GridItem>
        <GridItem area="address">
          <Flex alignItems="flex-end" height="100%">
            <LabelWithCopy
              color="gray.3"
              text={recodeAddress(address, ss58Format)}
              textSize={16}
              textVariant="b3"
            />
          </Flex>
        </GridItem>
        <GridItem area="balance">
          <Flex height="100%" justifyContent="flex-end">
            <Text
              color="gray.1"
              style={{ whiteSpace: 'nowrap' }}
              title={
                balance?.locked &&
                `${formatAmount(balance.locked)} POLYX is unavailable to use`
              }
              variant="b3"
            >
              {formatAmount(balance?.transferrable || 0)} POLYX
            </Text>
          </Flex>
        </GridItem>
      </AccountInfoGrid>
    );
  };

  const getNetworkDashboardLink = () => {
    return networkLinks[network].dashboard;
  };

  const assign = (e: React.MouseEvent<HTMLElement>) => {
    if (e.stopPropagation) e.stopPropagation();
    chrome.tabs.create({ url: `${getNetworkDashboardLink()}/overview` });
  };

  const renderHoverAccountInfo = () => {
    return (
      <UnassignedAccountHoverGrid>
        {isEditing && (
          <GridItem area="name-edit">
            <NameEdit
              newName={newName}
              onCancel={cancelEditing}
              onChange={handleNameChange}
              onSave={save}
            />
          </GridItem>
        )}
        {!isEditing && (
          <GridItem area="name">
            <Flex
              flexDirection="row"
              onMouseEnter={nameMouseEnter}
              onMouseLeave={nameMouseLeave}
            >
              <TextOverflowEllipsis color="gray.1" variant="b2m">
                {name}
              </TextOverflowEllipsis>
              <Flex ml="xs">
                <Icon
                  Asset={SvgPencilOutline}
                  color={nameHover ? 'gray.2' : 'gray.5'}
                  height={16}
                  onClick={editName}
                  style={{ cursor: 'pointer' }}
                  width={16}
                />
              </Flex>
            </Flex>
          </GridItem>
        )}
        <GridItem area="assign">
          <Flex alignItems="center" height="100%" justifyContent="flex-end">
            <ButtonSmall onClick={assign}>Assign</ButtonSmall>
          </Flex>
        </GridItem>
        <GridItem area="address">
          <LabelWithCopy
            color="gray.3"
            text={recodeAddress(address, ss58Format)}
            textSize={16}
            textVariant="b3"
          />
        </GridItem>
      </UnassignedAccountHoverGrid>
    );
  };

  return (
    <>
      <Box
        bg={hover ? 'gray8' : isSelected ? '#F8F9FC' : 'white'}
        mt="s"
        onClick={selectAccount}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        px="s"
        style={{ cursor: 'pointer' }}
      >
        <AccountViewGrid>
          <GridItem area="avatar">
            <InitialsAvatar name={name} />
          </GridItem>
          <GridItem area="account-info">
            <Box>
              {(!hover || did) && renderAccountInfo()}
              {hover && !did && renderHoverAccountInfo()}
            </Box>
          </GridItem>
          <GridItem area="options">
            <Flex
              alignItems="flex-end"
              flexDirection="column"
              height="46px"
              justifyContent="space-around"
            >
              <Box width={24}>
                {isSelected && (
                  <Icon
                    Asset={SvgCheck}
                    color="polyPink"
                    height={24}
                    width={24}
                  />
                )}
              </Box>
              <Box mb="xs" mt="auto">
                <OptionSelector
                  onSelect={(value) => handleMenuClick(address, value)}
                  options={getMenuItems(address)}
                  selector={
                    <Icon
                      Asset={SvgDotsVertical}
                      color="gray.1"
                      height={16}
                      style={{ cursor: 'pointer' }}
                      width={16}
                    />
                  }
                />
              </Box>
            </Flex>
          </GridItem>
        </AccountViewGrid>
      </Box>
    </>
  );
};
