import React, { FC } from 'react';
import { IdentifiedAccount } from '@polymathnetwork/extension-core/types';
import { Box, Text, Flex, Icon, LabelWithCopy } from '../../ui';
import { SvgAlertCircle } from '@polymathnetwork/extension-ui/assets/images/icons';
import { AccountView } from './AccountView';

export interface Props {
  headerText: string;
  selectedAccount: string;
  accounts: IdentifiedAccount[];
  headerColor: string;
}

export const AccountsContainer: FC<Props> = ({ accounts, headerColor, headerText, selectedAccount }) => {
  const renderContainerHeader = (isAssigned: boolean) => {
    if (isAssigned) {
      return (
        <Box bg={headerColor}
          borderRadius='2'
          mt='xs'
          mx='s'
          px='s'>
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
