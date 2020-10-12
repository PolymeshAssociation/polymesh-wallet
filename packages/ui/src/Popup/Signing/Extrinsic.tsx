import { SignerPayloadJSON } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { Table } from '../../components';
import useTranslation from '../../hooks/useTranslation';
import { getPolyCallDetails } from '@polymathnetwork/extension-ui/messaging';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';

interface Props {
  request: SignerPayloadJSON;
}

function renderMethod (call: ResponsePolyCallDetails, t: TFunction): React.ReactNode {
  const { args, meta, method, networkFee, protocolFee, section } = call;
  const totalFees = (new BN(networkFee)).add(new BN(protocolFee));

  return (
    <>
      <tr>
        <td className='label'>{t<string>('Method')}</td>
        <td className='data'>
          <details>
            <summary>{section}.{method}{
              meta
                ? `(${meta.args.map(({ name }) => name).join(', ')})`
                : ''
            }</summary>
            <pre>{JSON.stringify(args, null, 2)}</pre>
          </details>
        </td>
      </tr>
      <tr>
        <td className='label'>{t<string>('Network Fee')}</td>
        <td className='data'>
          {formatBalance(new BN(networkFee), { withUnit: false, decimals: 6 })} POLYX
        </td>
      </tr>
      <tr>
        <td className='label'>{t<string>('Protocol Fee')}</td>
        <td className='data'>
          {formatBalance(new BN(protocolFee), { withUnit: false })} POLYX
        </td>
      </tr>
      <tr>
        <td className='label'>{t<string>('Total Fees')}</td>
        <td className='data'>
          {formatBalance(totalFees, { withUnit: false })} POLYX
        </td>
      </tr>
    </>
  );
}

function Extrinsic ({ request }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [callDetails, setCallDetails] = useState<ResponsePolyCallDetails>();

  useEffect(() => {
    getPolyCallDetails(request)
      .then(setCallDetails)
      .catch(console.error);
  }, [request]);

  return (
    <Table
      isFull
    >
      {callDetails && renderMethod(callDetails, t)}
    </Table>
  );
}

export default React.memo(Extrinsic);
