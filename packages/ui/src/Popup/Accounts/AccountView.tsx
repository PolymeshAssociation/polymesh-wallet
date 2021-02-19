import { networkLinks } from '@polymathnetwork/extension-core/constants';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { SvgCheck, SvgDotsVertical, SvgPencilOutline, SvgWindowClose } from '@polymathnetwork/extension-ui/assets/images/icons';
import BigNumber from 'bignumber.js';
import React, { FC, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { AccountType, ActionContext, PolymeshContext } from '../../components';
import { editAccount, setPolySelectedAccount } from '../../messaging';
import { Box, ButtonSmall, ContextMenuTrigger, Flex, Icon, LabelWithCopy, Menu, MenuItem, Text, TextInput, TextOverflowEllipsis } from '../../ui';
import { formatters } from '../../util';

export interface Props {
  account: IdentifiedAccount;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({ account, isSelected }) => {
  const { address, balance, did, keyType, name } = account;

  const onAction = useContext(ActionContext);
  const history = useHistory();

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [hover, setHover] = useState(false);
  const [nameHover, setNameHover] = useState(false);

  const { network } = useContext(PolymeshContext);

  const renderMenuItems = (address: string) => {
    return (
      <>
        {/* @ts-ignore */}
        <Menu id={`account_menu_${address}`}>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'export', address }}
            onClick={handleMenuClick}>
            <Text color='gray.2'
              variant='b1'>Export account</Text>
          </MenuItem>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'forget', address }}
            onClick={handleMenuClick}>
            <Text color='gray.2'
              variant='b1'>Forget account</Text>
          </MenuItem>
        </Menu>
      </>
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
    if (address) {
      await setPolySelectedAccount(address);
      onAction();
    }
  };

  const renderAccountInfo = () => {
    return (
      <AccountDetailsGrid>
        {isEditing && (
          <GridItem area='name-edit'>
            <Flex alignItems='end'
              flexDirection='row'>
              <TextInput
                defaultValue={name}
                onChange={handleNameChange}
                tight
                value={newName}
              />
              <Box ml='xs'>
                <Icon
                  Asset={SvgCheck}
                  color='gray.2'
                  height={16}
                  onClick={save}
                  width={16}
                />
              </Box>
              <Box ml='xs'>
                <Icon
                  Asset={SvgWindowClose}
                  color='gray.2'
                  height={16}
                  onClick={cancelEditing}
                  width={16}
                />
              </Box>
            </Flex>
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
              <TextOverflowEllipsis
                color='gray.1'
                maxWidth='100px'
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
            {!isEditing && did && <AccountType keyType={keyType} />}
          </Flex>
        </GridItem>
        <GridItem area='address'>
          <Flex alignItems='flex-end'
            height='100%'>
            <LabelWithCopy
              color='gray.3'
              text={address}
              textSize={13}
              textVariant='b3'
            />
          </Flex>
        </GridItem>
        <GridItem area='balance'>
          <Flex height='100%'
            justifyContent='flex-end'>
            <Text color='gray.1'
              style={{ whiteSpace: 'nowrap' }}
              variant='b3'>
              {formatters.formatAmount(new BigNumber(balance || 0), 2, true)}{' '}
              POLYX
            </Text>
          </Flex>
        </GridItem>
      </AccountDetailsGrid>
    );
  };

  const getNetworkDashboardLink = () => {
    return networkLinks[network as NetworkName].dashboard;
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
            <Flex flexDirection='row'>
              <TextInput
                defaultValue={name}
                onChange={handleNameChange}
                tight
                value={newName}
              />
              <Box ml='xs'>
                <Icon
                  Asset={SvgCheck}
                  color='gray.2'
                  height={16}
                  onClick={save}
                  width={16}
                />
              </Box>
              <Box ml='xs'>
                <Icon
                  Asset={SvgWindowClose}
                  color='gray.2'
                  height={16}
                  onClick={cancelEditing}
                  width={16}
                />
              </Box>
            </Flex>
          </GridItem>
        )}
        {!isEditing && (
          <GridItem area='name'>
            <Flex
              flexDirection='row'
              onMouseEnter={nameMouseEnter}
              onMouseLeave={nameMouseLeave}
            >
              <TextOverflowEllipsis
                color='gray.1'
                maxWidth='100px'
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
            text={address}
            textSize={13}
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
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        px='s'
      >
        <AccountViewGrid>
          <Box onClick={selectAccount}
            style={{ cursor: 'pointer' }}>
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
          </Box>
          <Box>
            {(!hover || did) && renderAccountInfo()}
            {hover && !did && renderHoverAccountInfo()}
          </Box>
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
        </AccountViewGrid>
      </Box>
    </>
  );
};

const AccountViewGrid = styled.div`
  display: grid;
  grid-template-areas: 'avatar account-details options';
  gap: 10px;
  grid-template-columns: 35px 200px 35px;
`;

const AccountDetailsGrid = styled.div`
  display: grid;
  grid-template-areas:
    'name-edit name-edit name-edit name-edit'
    'name      name      name      type'
    'address   address   balance   balance';
`;

const UnassignedAccountHoverGrid = styled.div`
  display: grid;
  grid-template-areas:
    'name-edit name-edit name-edit name-edit'
    'name      name      name      assign'
    'address   address   address   assign';
`;

const GridItem = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
`;
