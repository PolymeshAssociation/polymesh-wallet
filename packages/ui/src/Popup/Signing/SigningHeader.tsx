import type { ReactElement } from 'react';
import type { IdentifiedAccount } from '@polymeshassociation/extension-core/types';

import React, { useCallback } from 'react';

import { SvgOpenInNew } from '@polymeshassociation/extension-ui/assets/images/icons';
import { useIsPopup } from '@polymeshassociation/extension-ui/hooks';
import { windowOpen } from '@polymeshassociation/extension-ui/messaging';
import { Box, Flex, GrowingButton, Heading, LabelWithCopy, Text } from '@polymeshassociation/extension-ui/ui';
import { Header } from '@polymeshassociation/extension-ui/ui/Header/Header';

import { formatAmount } from '../../util/formatters';
import { NetworkSelector } from '../Accounts/NetworkSelector';
import TransactionIndex from './TransactionIndex';

interface Props {
  account?: IdentifiedAccount;
  canShowBalance: boolean;
  displayAddress?: string;
  requestIndex: number;
  title: string;
  totalRequests: number;
  onNextClick: () => void;
  onPreviousClick: () => void;
  showBalanceSection: boolean;
}

function SigningHeader ({ account,
  canShowBalance,
  displayAddress,
  onNextClick,
  onPreviousClick,
  requestIndex,
  showBalanceSection,
  title,
  totalRequests }: Props): ReactElement {
  const isPopup = useIsPopup();

  const onOpenInNewTab = useCallback((): void => {
    windowOpen('/')
      .then(() => {
        if (isPopup) {
          window.close();
        }
      })
      .catch(console.error);
  }, [isPopup]);

  return (
    <Header>
      <Flex
        alignItems='center'
        flexDirection='row'
        justifyContent={isPopup ? 'space-between' : 'flex-start'}
      >
        <NetworkSelector />
        {isPopup && (
          <GrowingButton
            hoverLabel='Open in browser'
            icon={SvgOpenInNew}
            onClick={onOpenInNewTab}
          />
        )}
      </Flex>
      <Box mt='xs'>
        <Heading
          color='white'
          variant='h5'
        >
          {title}
        </Heading>
      </Box>
      {account && (
        <>
          <Box mt='xs'>
            <Text
              as='div'
              color='gray.0'
              variant='b2m'
            >
              {account.name}
            </Text>
            {displayAddress && (
              <Box
                mt='3px'
              >
                <LabelWithCopy
                  color='brandLightest'
                  hoverColor='brandLighter'
                  text={displayAddress}
                  textSize={34}
                  textVariant='b3'
                />
              </Box>
            )}
          </Box>
          {showBalanceSection && (
            <Box mt='xs'>
              {canShowBalance
                ? (
                  <Flex alignItems='baseline'>
                    <Text
                      color='gray.0'
                      mr='6px'
                      variant='b3m'
                    >
                      Available
                    </Text>
                    <Text
                      color='white'
                      variant='b2m'
                    >
                      {formatAmount(account.balance?.transferrable || 0)}
                    </Text>
                    <Text
                      color='white'
                      ml='4px'
                      variant='b3m'
                    >
                      POLYX
                    </Text>
                  </Flex>
                )
                : (
                  <Text
                    color='white'
                    variant='b3'
                  >
                    Connect to the correct chain to show available balance.
                  </Text>
                )}
            </Box>
          )}
        </>
      )}
      {totalRequests > 1 && (
        <Box mt='m'>
          <TransactionIndex
            index={requestIndex}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            totalItems={totalRequests}
          />
        </Box>
      )}
    </Header>
  );
}

export default SigningHeader;
