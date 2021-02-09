import { SignerPayloadJSON } from '@polkadot/types/types';
import { formatBalance } from '@polkadot/util';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { nonFatalErrorHandler } from '@polymathnetwork/extension-core/utils';
import { getPolyCallDetails } from '@polymathnetwork/extension-ui/messaging';
import { Box, ExpandableDetails, Flex, Hr, Loading, Text } from '@polymathnetwork/extension-ui/ui';
import BN from 'bn.js';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  request: SignerPayloadJSON;
}

const Method: FC<{call: ResponsePolyCallDetails}> = ({ call }) => {
  const { args, meta, method, networkFee, protocolFee, section } = call;

  const fees: [string, string][] = [];

  if (networkFee && networkFee.length) {
    fees.push(['Network fee', formatBalance(new BN(networkFee), { withUnit: false, decimals: 6 })]);
  }

  if (protocolFee && protocolFee !== '0') {
    fees.push(['Protocol fee', formatBalance(new BN(protocolFee), { withUnit: false, decimals: 6 })]);
    const totalFees = (new BN(networkFee)).add(new BN(protocolFee));

    fees.push(['Total fees', formatBalance(new BN(totalFees), { withUnit: false, decimals: 6 })]);
  }

  return (
    <Flex alignItems='stretch'
      flex={1}
      flexDirection='column'
      justifyContent='space-between'
      style={{ height: '100%' }}>
      <Box mt='m'>
        <ExpandableDetails title={`${section}: ${method}${
          meta
            ? `(${meta.args.map(({ name }) => name).join(', ')})`
            : ''
        }`}>
          <Box mt='m'
            mx='s'>
            <Box>
              <Text color='gray.2'
                variant='b2'>
                Parameters
              </Text>
            </Box>
            <Box>
              <Text color='gray.1'
                variant='code'>
                {JSON.stringify(args, null, 2).slice(1, -1).trim()}
              </Text>
            </Box>
          </Box>
        </ExpandableDetails>
      </Box>

      <Box mb='l'>
        {fees.length > 1 && <Hr color='gray.4' />}
        <Box>
          {fees.map((tuple, index) => {
            return (
              <Box
                {...(index === fees.length - 1 ? { bg: 'gray.4' } : {})}
                key={index}
              >
                <Flex justifyContent='space-between'
                  mx='s'>
                  <Box>
                    <Text color='gray.1'
                      variant='b3m'>
                      {tuple[0]}
                    </Text>
                  </Box>

                  <Box>
                    <Text color='gray.1'
                      variant='b2m'>
                      {tuple[1]}
                    </Text>
                    <Text color='gray.2'
                      ml={1}
                      variant='b2m'>POLYX</Text>
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

function Extrinsic ({ request }: Props): React.ReactElement<Props> {
  const [callDetails, setCallDetails] = useState<ResponsePolyCallDetails>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPolyCallDetails(request)
      .then((callDetails) => {
        setCallDetails(callDetails);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [request]);

  return (
    <>
      {loading &&
        <Flex alignItems='center'
          justifyContent='center'
          my='l'>
          <Loading />
        </Flex>
      }
      {callDetails && <Method call={callDetails} />}
    </>
  );
}

export default React.memo(Extrinsic);
