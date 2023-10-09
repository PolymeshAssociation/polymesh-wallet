import { PolymeshContext } from '@polymeshassociation/extension-ui/components';
import React, { FC, useContext } from 'react';
import { useParams } from 'react-router';

import { AccountView } from './AccountView';

interface AddressState {
  address: string;
}

export const AccountDetails: FC = () => {
  const { address } = useParams<AddressState>();
  const { polymeshAccounts } = useContext(PolymeshContext);

  const selectedAccount = polymeshAccounts?.find(
    (account) => account.address === address
  );

  return (
    <AccountView
      address={address}
      onClose={close}
      selectedAccount={selectedAccount}
    />
  );
};
