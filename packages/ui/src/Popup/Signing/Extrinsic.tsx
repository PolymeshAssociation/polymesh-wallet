import { SignerPayloadJSON } from '@polkadot/types/types';

import React, { FC, useEffect, useState } from 'react';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { getPolyCallDetails } from '@polymathnetwork/extension-ui/messaging';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { Box, Flex, Loading, Text } from '@polymathnetwork/extension-ui/ui';

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
    <>

      <Box mt='m'>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Method
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='code'>
            {section}.{method}{
              meta
                ? `(${meta.args.map(({ name }) => name).join(', ')})`
                : ''
            }
          </Text>
        </Box>
      </Box>

      <Box mt='m'>
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

      <Box
        borderTop='2px solid'
        borderTopColor='gray.4'
      >
        {fees.map((tuple, index) =>
          <Flex
            justifyContent='space-between'
            {...(index === fees.length - 1 ? {} : { bg: 'gray.2' })}
            bg='gray.4'

            key={index}
          >
            <Box >
              <Text color='highlightText'
                variant='b1m'>
                {tuple[0]}
              </Text>
            </Box>

            <Box>
              <Text color='highlightText'
                variant='b1m'>
                {tuple[1]}
              </Text>
              <Text color='gray.2'
                ml={1}>POLYX</Text>
            </Box>
          </Flex>
        )}
      </Box>
    </>
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
