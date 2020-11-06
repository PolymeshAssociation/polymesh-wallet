import React, { FC, useState, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { IdentifiedAccount, NetworkName } from '@polymathnetwork/extension-core/types';
import { formatters } from '../../util';
import { Box, Text, Flex, Icon, TextInput, ButtonSmall, LabelWithCopy, Menu, MenuItem, ContextMenuTrigger } from '../../ui';
import { SvgPencilOutline, SvgWindowClose, SvgCheck, SvgDotsVertical } from '@polymathnetwork/extension-ui/assets/images/icons';
import { editAccount, setPolySelectedAccount } from '../../messaging';
import { AccountType, ActionContext, PolymeshContext } from '../../components';
import { useHistory } from 'react-router-dom';
import { networkLinks } from '@polymathnetwork/extension-core/constants';

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
            Export account
          </MenuItem>
          {/* @ts-ignore */}
          <MenuItem data={{ action: 'forget', address }}
            onClick={handleMenuClick}>
            Forget account
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
      <>
        <Flex
          flexDirection='row'
          justifyContent='space-between'
        >
          <Flex flexDirection='row'>
            {isEditing && (
              <Flex alignItems='center'
                flexDirection='row'>
                <TextInput defaultValue={name}
                  onChange={handleNameChange}
                  tight
                  value={newName} />
                <Box ml='xs'>
                  <Icon Asset={SvgCheck}
                    color='gray.2'
                    height={16}
                    onClick={save}
                    width={16} />
                </Box>
                <Box ml='xs'>
                  <Icon Asset={SvgWindowClose}
                    color='gray.2'
                    height={16}
                    onClick={cancelEditing}
                    width={16} />
                </Box>
              </Flex>
            )}
            {!isEditing && (
              <Flex alignItems='center'
                flexDirection='row'
                onMouseEnter={nameMouseEnter}
                onMouseLeave={nameMouseLeave}>
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
                <Flex ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color={nameHover ? 'gray.2' : 'gray.5'}
                    height={16}
                    onClick={editName}
                    width={16} />
                </Flex>
              </Flex>
            )}
            <Box ml='s'>
              {!isEditing && did && <AccountType keyType={keyType} />}
            </Box>
          </Flex>
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
              {formatters.formatAmount(new BigNumber(balance || 0), 2, true)} POLYX
            </Text>
          </Box>
        </Flex>
      </>
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
      <>
        <Flex
          flexDirection='row'
          justifyContent='space-between'
        >
          <Box>
            {isEditing && (
              <Flex flexDirection='row'>
                <TextInput defaultValue={name}
                  onChange={handleNameChange}
                  tight
                  value={newName} />
                <Box ml='xs'>
                  <Icon Asset={SvgCheck}
                    color='gray.2'
                    height={16}
                    onClick={save}
                    width={16} />
                </Box>
                <Box ml='xs'>
                  <Icon Asset={SvgWindowClose}
                    color='gray.2'
                    height={16}
                    onClick={cancelEditing}
                    width={16} />
                </Box>
              </Flex>
            )}
            {!isEditing && (
              <Flex flexDirection='row'
                onMouseEnter={nameMouseEnter}
                onMouseLeave={nameMouseLeave}>
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
                <Flex ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color={nameHover ? 'gray.2' : 'gray.5'}
                    height={16}
                    onClick={editName}
                    width={16} />
                </Flex>
              </Flex>
            )}
            <LabelWithCopy color='gray.3'
              text={address}
              textSize={13}
              textVariant='b3'
            />
          </Box>
          <Box>
            <ButtonSmall onClick={assign}
              variant='secondary'>Assign</ButtonSmall>
          </Box>
        </Flex>
      </>
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
        px='s'>
        <Flex justifyContent='space-between'>
          <Box>
            <Box
              backgroundColor='brandLightest'
              borderRadius='50%'
              height={32}
              px='2'
              width={32}
            >
              <Flex justifyContent='center'
                pt='xs'>
                <Text color='brandMain'
                  variant='b2m'>{name?.substr(0, 1)}</Text>
              </Flex>
            </Box>
          </Box>
          <Box ml='s'
            width='100%'>
            {(!hover || did) && renderAccountInfo()}
            {(hover && !did) && renderHoverAccountInfo()}
          </Box>
          <Flex alignItems='flex-end'
            flexDirection='column'
            justifyContent='flex-end'>
            <Box width={24}>
              {
                isSelected &&
                  <Icon Asset={SvgCheck}
                    color='brandMain'
                    height={24}
                    width={24} />
              }
            </Box>
            <Box>
              {renderActionsMenuButton(address)}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
