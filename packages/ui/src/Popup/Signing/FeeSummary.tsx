import { BN } from '@polkadot/util';
import React from 'react';

import { Box, Flex, Text } from '@polymeshassociation/extension-ui/ui';
import { formatAmount } from '@polymeshassociation/extension-ui/util/formatters';

interface Props {
  feeLoading?: boolean;
  networkFee?: string;
  protocolFee?: string;
  feeNotice?: string;
}

function FeeSummary ({ feeLoading = false,
  feeNotice,
  networkFee = '',
  protocolFee = '' }: Props): React.ReactElement | null {
  const fees: [string, string][] = [];

  if (networkFee.length) {
    fees.push(['Network fee', formatAmount(networkFee)]);
  }

  if (protocolFee && protocolFee !== '0') {
    fees.push(['Protocol fee', formatAmount(protocolFee)]);
    fees.push(['Total fees', formatAmount(new BN(networkFee || '0').add(new BN(protocolFee)))]);
  }

  if (!feeLoading && !feeNotice && fees.length === 0) {
    return null;
  }

  return (
    <Box width='100%'>
      {feeLoading || feeNotice
        ? (
          <Box
            bg='gray.5'
            px='10px'
            py='5px'
            width='100%'
          >
            <Text
              color='gray.2'
              variant='b3'
            >
              {feeLoading ? 'Estimating transaction fees...' : feeNotice}
            </Text>
          </Box>
        )
        : fees.length
          ? (
            <Box
              bg='gray.5'
              px='10px'
              py='5px'
              width='100%'
            >
              {fees.map(([label, amount], index) => {
                const isTotal = index === fees.length - 1;

                return (
                  <Flex
                    justifyContent='space-between'
                    key={label}
                    width='100%'
                  >
                    <Text
                      color='gray.1'
                      variant={isTotal ? 'b3m' : 'b3'}
                    >
                      {label}
                    </Text>
                    <Flex alignItems='baseline'>
                      <Text
                        color='gray.1'
                        variant={isTotal ? 'b2m' : 'b3m'}
                      >
                        {amount}
                      </Text>
                      <Text
                        color='gray.2'
                        ml={1}
                        variant={isTotal ? 'b2m' : 'b3m'}
                      >
                      POLYX
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </Box>
          )
          : null}
    </Box>
  );
}

export default FeeSummary;
