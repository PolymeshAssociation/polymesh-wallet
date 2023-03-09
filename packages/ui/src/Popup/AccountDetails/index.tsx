import {
  PolymeshContext,
  UidContext,
} from '@polymeshassociation/extension-ui/components';
import { getUid } from '@polymeshassociation/extension-ui/messaging';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { AccountView } from './AccountView';
import { DecodeUid } from './UnlockUid';

interface AddressState {
  address: string;
}

export const AccountDetails: FC = () => {
  const history = useHistory();
  const { address } = useParams<AddressState>();
  const {
    currentAccount,
    networkState: { selected: network },
    polymeshAccounts,
  } = useContext(PolymeshContext);
  const uidRecords = useContext(UidContext);
  const [hasUid, setHasUid] = useState(false);
  const [uidHidden, setUidHidden] = useState(true);
  const [showDecode, setShowDecode] = useState(false);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const uid = uidRecords?.find(
      (item) => item.did === currentAccount?.did && network === item.network
    );

    setHasUid(uid !== undefined);
  }, [uidRecords, currentAccount, network]);

  const close = () => {
    history.push('/');
  };

  const showHideUid = () => {
    if (uidHidden) {
      setShowDecode(true);
    } else {
      setUidHidden(!uidHidden);
    }
  };

  const decodeUid = async (password: string) => {
    if (!currentAccount?.did || !network) return false;

    const uid = await getUid(currentAccount?.did, network, password);

    if (!uid) {
      return false;
    } else {
      setUid(uid);
      closeDecode();
      setUidHidden(false);

      return true;
    }
  };

  const closeDecode = () => setShowDecode(false);

  const selectedAccount = polymeshAccounts?.find(
    (account) => account.address === address
  );

  if (showDecode) {
    return <DecodeUid decode={decodeUid} onClose={closeDecode} />;
  } else {
    return (
      <AccountView
        address={address}
        hasUid={hasUid}
        isUidHidden={uidHidden}
        onClose={close}
        selectedAccount={selectedAccount}
        showHideUid={showHideUid}
        uid={uid}
      />
    );
  }
};
