import React, { FC } from 'react';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { Button } from 'react-aria-menubutton';
import { useHistory } from 'react-router-dom';
import { Box, Text, Flex, Icon, Menu, MenuItem, Wrapper, LabelWithCopy } from '../../ui';
import { SvgDotsVertical,
  SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import { AccountView } from './AccountView';

export interface Props {
  headerText: string;
  selectedAccount: string;
  accounts: IdentifiedAccount[];
  headerColor: string;
}

export const AccountsContainer: FC<Props> = ({ accounts, headerColor, headerText, selectedAccount }) => {
  const history = useHistory();

  const renderMenuItems = () => {
    return (
      <>
        {/* @ts-ignore */}
        <MenuItem value='export'>Export account</MenuItem>
        {/* @ts-ignore */}
        <MenuItem value='forget'>Forget account</MenuItem>
      </>
    );
  };

  const handleMenuClick = (event: string) => {
    const { address } = accounts[0];

    switch (event) {
      case 'export':
        return history.push(`/account/export/${address}`);
      case 'forget':
        return history.push(`/account/forget/${address}`);
    }
  };

  const renderContainerHeader = (isAssigned: boolean) => {
    if (isAssigned) {
      return (
        <Box bg={headerColor}
          borderRadius='2'
          mt='xs'
          mx='s'
          px='s'
          py='xs'>
          <Flex flexDirection='row'
            justifyContent='space-between'>
            <LabelWithCopy color='brandMain'
              text={headerText}
              textSize={30}
              textVariant='c2'
            />
            <Box>
              <Flex flexDirection='row'>
                {
                  !accounts[0].cdd &&
                    <Box mr='m'>
                      <Icon Asset={SvgAlertCircle}
                        color='alert'
                        height={14}
                        width={14} />
                    </Box>
                }
                {/* @ts-ignore */}
                <Wrapper onSelection={handleMenuClick}>
                  <Button>
                    <Icon Asset={SvgDotsVertical}
                      color='gray.1'
                      height={16}
                      width={16} />
                  </Button>
                  {/* @ts-ignore */}
                  <Menu>{renderMenuItems()}</Menu>
                </Wrapper>
              </Flex>
            </Box>
          </Flex>
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
