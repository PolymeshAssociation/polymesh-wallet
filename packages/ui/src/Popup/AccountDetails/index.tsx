import { PolymeshContext, UidContext } from '@polymathnetwork/extension-ui/components';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { AccountView } from './AccountView';

interface AddressState {
  address: string;
}

export const AccountDetails: FC = () => {
  const history = useHistory();
  const { address } = useParams<AddressState>();
  const { currentAccount, network, polymeshAccounts } = useContext(PolymeshContext);
  const uidRecords = useContext(UidContext);
  const [hasUid, setHasUid] = useState(false);
  const [uidHidden, setUidHidden] = useState(true);

  useEffect(() => {
    const uid = uidRecords?.find((item) => item.did === currentAccount?.did && network === item.network);

    setHasUid(uid !== undefined);
  }, [uidRecords, currentAccount, network]);

  const close = () => {
    history.push('/');
  };

  const showHideUid = () => {
    setUidHidden(!uidHidden);
  };

  const selectedAccount = polymeshAccounts?.find((account) => account.address === address);

  return (
    <AccountView
      address={address}
      hasUid={hasUid}
      isUidHidden={uidHidden}
      onClose={close}
      selectedAccount={selectedAccount}
      showHideUid={showHideUid}
      uid='ghjfsdklgfhdjkls'
    />
  );
};
