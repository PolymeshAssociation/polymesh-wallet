import React, { FC, useState, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { formatters } from '../../util';
import { Box, Text, Flex, Icon, StatusBadge, TextInput, ButtonSmall, LabelWithCopy } from '../../ui';
import { SvgPencilOutline,
  SvgWindowClose,
  SvgCheck } from '@polymathnetwork/extension-ui/assets/images/icons';
import { editAccount, setPolySelectedAccount } from '../../messaging';
import { ActionContext } from '../../components';

export interface Props {
  account: IdentifiedAccount;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({ account, isSelected }) => {
  const { address, balance, did, keyType, name } = account;

  const onAction = useContext(ActionContext);

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [hover, setHover] = useState(false);

  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'green' : 'blue';
    const text = keyType === 'primary' ? 'Master' : 'Secondary';

    return (
      !isEditing && did && <StatusBadge variant={color}>{text}</StatusBadge>
    );
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const editName = () => {
    setEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const save = () => {
    editAccount(address, newName || '')
      .then(() => {
        onAction();
        setEditing(false);
      })
      .catch(console.error);
  };

  const mouseEnter = () => {
    setHover(true);
  };

  const mouseLeave = () => {
    setHover(false);
  };

  const selectAccount = () => {
    console.log('SELECTING', address);
    setPolySelectedAccount(address)
      .then(() => {
        onAction();
      })
      .catch(console.error);
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
              <Flex flexDirection='row'>
                <TextInput defaultValue={name}
                  onChange={handleNameChange}
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
              <Flex flexDirection='row'>
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
                <Box ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color='gray.2'
                    height={16}
                    onClick={editName}
                    width={16} />
                </Box>
              </Flex>
            )}
            <Box ml='s'>
              {renderType(keyType || '')}
            </Box>
          </Flex>
          {
            isSelected &&
              <Icon Asset={SvgCheck}
                color='brandMain'
                height={24}
                width={24} />
          }
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
              <Flex flexDirection='row'>
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
                <Box ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color='gray.2'
                    height={16}
                    onClick={editName}
                    width={16} />
                </Box>
              </Flex>
            )}
            <LabelWithCopy color='gray.3'
              text={address}
              textSize={13}
              textVariant='b3'
            />
          </Box>
          <Box>
            <ButtonSmall variant='secondary'>Assign</ButtonSmall>
          </Box>
        </Flex>
      </>
    );
  };

  return (
    <Box
      bg={isSelected ? 'gray.5' : 'gray.0'}
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
      </Flex>
    </Box>
  );
};
