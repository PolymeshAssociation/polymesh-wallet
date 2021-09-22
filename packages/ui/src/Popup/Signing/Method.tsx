import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { Box, ExpandableDetails, Flex, Hr, Text } from '@polymathnetwork/extension-ui/ui';
import { formatAmount } from '@polymathnetwork/extension-ui/util/formatters';
import BN from 'bn.js';
import React, { FC } from 'react';

const Method: FC<{call: ResponsePolyCallDetails}> = ({ call }) => {
  const { args, meta, method, networkFee, protocolFee, section } = call;

  const fees: [string, string][] = [];

  if (networkFee && networkFee.length) {
    fees.push(['Network fee', formatAmount(networkFee)]);
  }

  if (protocolFee && protocolFee !== '0') {
    fees.push(['Protocol fee', formatAmount(protocolFee)]);
    const totalFees = (new BN(networkFee)).add(new BN(protocolFee));

    fees.push(['Total fees', formatAmount(totalFees)]);
  }

  return (
    <Flex
      alignItems='stretch'
      flexDirection='column'
      height='100%'
    >
      <Box
        height='100%'
        mt='m'
        style={{ overflowY: 'scroll' }}
      >
        <ExpandableDetails title={`${section}: ${method}${
          meta
            ? `(${meta.args.map(({ name }) => name).join(', ')})`
            : ''
        }`}
        >
          <Box
            mt='m'
            mx='s'
          >
            <Box>
              <Text
                color='gray.2'
                variant='b2'
              >
                Parameters
              </Text>
            </Box>
            <Box>
              <Text
                color='gray.1'
                variant='code'
              >
                {JSON.stringify(args, null, 2).slice(1, -1).trim()}
              </Text>
            </Box>
          </Box>
        </ExpandableDetails>
      </Box>

      <Box mt='auto'>
        {fees.length > 1 && <Hr color='gray.4' />}
        <Box>
          {fees.map((tuple, index) => {
            return (
              <Box
                {...(index === fees.length - 1 ? { bg: 'gray.4' } : {})}
                key={index}
              >
                <Flex
                  justifyContent='space-between'
                  mx='s'
                >
                  <Box>
                    <Text
                      color='gray.1'
                      variant='b3m'
                    >
                      {tuple[0]}
                    </Text>
                  </Box>

                  <Box>
                    <Text
                      color='gray.1'
                      variant='b2m'
                    >
                      {tuple[1]}
                    </Text>
                    <Text
                      color='gray.2'
                      ml={1}
                      variant='b2m'
                    >POLYX</Text>
                  </Box>
                </Flex>
              </Box>
            );
          }
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Method;
