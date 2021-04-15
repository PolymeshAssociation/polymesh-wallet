import { networkLinks } from '@polymathnetwork/extension-core/constants';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { recodeAddress } from '@polymathnetwork/extension-core/utils';
import { SvgCheck, SvgDotsVertical, SvgPencilOutline, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import BigNumber from 'bignumber.js';
import React, { FC, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AccountContext, AccountType, ActionContext, PolymeshContext } from '../../components';
import { editAccount, setPolySelectedAccount } from '../../messaging';
import { Box, ButtonSmall, ContextMenuTrigger, Flex, Icon, LabelWithCopy, Menu, MenuItem, Text, TextInput, TextOverflowEllipsis } from '../../ui';
import { formatters } from '../../util';
import { AccountInfoGrid, AccountViewGrid, GridItem, UnassignedAccountHoverGrid } from './styles';

type NameEditProps = {
  name?: string;
  newName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: (e: React.MouseEvent<HTMLElement>) => Promise<void>
  onCancel: (e: React.MouseEvent<HTMLElement>) => void;
}

const NameEdit: FC<NameEditProps> = ({ name, newName, onCancel, onChange, onSave }) => (<Box py='3px'>
  <Flex alignItems='center'
    flexDirection='row'>
    <TextInput
      defaultValue={name}
      onChange={onChange}
      tight
      value={newName}
    />
    <Box ml='xs'>
      <Icon
        Asset={SvgCheck}
        color='gray.2'
        height={16}
        onClick={onSave}
        width={16}
      />
    </Box>
    <Box ml='xs'>
      <Icon
        Asset={SvgWindowClose}
        color='gray.2'
        height={16}
        onClick={onCancel}
        width={16}
      />
    </Box>
  </Flex>
</Box>);

export interface Props {
  account: IdentifiedAccount;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({ account, isSelected }) => {
  const { address, balance, did, keyType, name } = account;

  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);

  const history = useHistory();

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [hover, setHover] = useState(false);
  const [nameHover, setNameHover] = useState(false);
  const { networkState: { selected: network, ss58Format } } = useContext(PolymeshContext);

  const renderMenuItems = (address: string) => {
    const account = accounts.find((_account) => _account.address === address);
    const isLedgerAccount = account?.isHardware && account.hardwareType === 'ledger';

    return (
      <Menu id={`account_menu_${address}`}>
        {!isLedgerAccount &&
          <MenuItem data={{ action: 'export', address }}
            onClick={handleMenuClick}>
            <Text color='gray.2'
              variant='b1'>Export account</Text>
          </MenuItem>
        }
        <MenuItem data={{ action: 'forget', address }}
          onClick={handleMenuClick}>
          <Text color='gray.2'
            variant='b1'>Forget account</Text>
        </MenuItem>
      </Menu>
    );
  };

  const handleMenuClick = (event: string, data: {action:string, address: string}) => {
    const { action, address } = data;

    switch (action) {
      case 'export':
        return history.push(`/account/export/${address}`);
      case 'forget':
        return history.push(`/account/forget/${address}`);
    }
  };

  const renderActionsMenuButton = (address: string) => {
    return (
      <>
        <ContextMenuTrigger id={`account_menu_${address}`}
          mouseButton={0}>
          <Icon Asset={SvgDotsVertical}
            color='gray.1'
            height={16}
            style={{ cursor: 'pointer' }}
            width={16} />
        </ContextMenuTrigger>
      </>
    );
  };

  const cancelEditing = (e: React.MouseEvent<HTMLElement>) => {
    setEditing(false);
    if (e.stopPropagation) e.stopPropagation();
  };

  const editName = (e: React.MouseEvent<HTMLElement>) => {
    setNameHover(false);
    setEditing(true);
    if (e.stopPropagation) e.stopPropagation();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const save = async (e: React.MouseEvent<HTMLElement>) => {
    if (e.stopPropagation) e.stopPropagation();
    await editAccount(address || '', newName || '');
    onAction();
    setEditing(false);
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
          <GridItem area='name-edit'>
            <NameEdit name={name}
              newName={newName}
              onCancel={cancelEditing}
              onChange={handleNameChange}
              onSave={save} />
          </GridItem>
        )}
        {!isEditing && (
          <GridItem area='name'>
            <Flex
              flexDirection='row'
              minWidth='100px'
              onMouseEnter={nameMouseEnter}
              onMouseLeave={nameMouseLeave}
            >
              <TextOverflowEllipsis color='gray.1'
                variant='b2m'
              >
                {name}
              </TextOverflowEllipsis>
              <Flex ml='xs'>
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
        <GridItem area='type'>
          <Flex height='100%'
            justifyContent='flex-end'>
            {did && <AccountType keyType={keyType} />}
          </Flex>
        </GridItem>
        {/* @ADDRESS should be formatted */}
        <GridItem area='address'>
          <Flex alignItems='flex-end'
            height='100%'>
            <LabelWithCopy
              color='gray.3'
              text={recodeAddress(address, ss58Format)}
              textSize={16}
              textVariant='b3'
            />
          </Flex>
        </GridItem>
        <GridItem area='balance'>
          <Flex height='100%'
            justifyContent='flex-end'>
            <Text color='gray.1'
              style={{ whiteSpace: 'nowrap' }}
              title={balance?.locked && `${formatters.formatAmount(new BigNumber(balance.locked), 2, true)} POLYX is unavailable to use`}
              variant='b3'>
              {formatters.formatAmount(new BigNumber(balance?.transferrable || 0), 2, true)}{' '}
              POLYX
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
    chrome.tabs.create({ url: `${getNetworkDashboardLink()}account` });
  };

  const renderHoverAccountInfo = () => {
    return (
      <UnassignedAccountHoverGrid>
        {isEditing && (
          <GridItem area='name-edit'>
            <NameEdit name={name}
              newName={newName}
              onCancel={cancelEditing}
              onChange={handleNameChange}
              onSave={save} />
          </GridItem>
        )}
        {!isEditing && (
          <GridItem area='name'>
            <Flex
              flexDirection='row'
              onMouseEnter={nameMouseEnter}
              onMouseLeave={nameMouseLeave}
            >
              <TextOverflowEllipsis color='gray.1'
                variant='b2m'
              >
                {name}
              </TextOverflowEllipsis>
              <Flex ml='xs'>
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
        <GridItem area='assign'>
          <Flex alignItems='center'
            height='100%'
            justifyContent='flex-end'>
            <ButtonSmall onClick={assign}
              variant='secondary'>
              Assign
            </ButtonSmall>
          </Flex>
        </GridItem>
        <GridItem area='address'>
          <LabelWithCopy
            color='gray.3'
            text={recodeAddress(address, ss58Format)}
            textSize={16}
            textVariant='b3'
          />
        </GridItem>
      </UnassignedAccountHoverGrid>
    );
  };

  return (
    <>
      {renderMenuItems(address)}
      <Box
        bg={hover ? 'gray.5' : 'gray.0'}
        mt='s'
        onClick={selectAccount}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        px='s'
        style={{ cursor: 'pointer' }}
      >
        <AccountViewGrid>
          <GridItem area='avatar'>
            <Flex height='100%'>
              <Box
                backgroundColor='brandLightest'
                borderRadius='50%'
                height={32}
                px='2'
                width={32}
              >
                <Flex justifyContent='center'
                  pt='xxs'>
                  <Text color='brandMain'
                    variant='b2m'>
                    {name?.substr(0, 1)}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </GridItem>
          <GridItem area='account-info'>
            <Box>
              {(!hover || did) && renderAccountInfo()}
              {hover && !did && renderHoverAccountInfo()}
            </Box>
          </GridItem>
          <GridItem area='options'>
            <Flex
              alignItems='flex-end'
              flexDirection='column'
              justifyContent='space-around'
            >
              <Box width={24}>
                {isSelected && (
                  <Icon
                    Asset={SvgCheck}
                    color='brandMain'
                    height={24}
                    width={24}
                  />
                )}
              </Box>
              <Box>{renderActionsMenuButton(address)}</Box>
            </Flex>
          </GridItem>
        </AccountViewGrid>
      </Box>
    </>
  );
};
