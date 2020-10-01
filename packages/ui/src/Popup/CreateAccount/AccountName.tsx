import React, { useCallback, useState } from 'react';

import { Address, BackButton, ButtonArea, NextStepButton, VerticalSpace } from '../../components';
import { Name, Password } from '../../partials';

interface Props {
  address: string;
  isBusy: boolean;
  onBackClick: () => void;
  onCreate: (name: string, password: string) => void | Promise<void | boolean>;
}

function AccountName ({ address, isBusy, onBackClick, onCreate }: Props): React.ReactElement<Props> {
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const _onCreate = useCallback(
    () => name && password && onCreate(name, password),
    [name, password, onCreate]
  );

  return (
    <>
      <Name
        isFocused
        onChange={setName}
      />
      {name && <Password onChange={setPassword} />}
      {name && password && (
        <Address
          address={address}
          name={name}
        />
      )}
      <VerticalSpace />
      <ButtonArea>
        <BackButton onClick={onBackClick} />
        <NextStepButton
          data-button-action='add new root'
          isBusy={isBusy}
          isDisabled={!password || !name}
          onClick={_onCreate}
        >
          Add the account with the generated seed
        </NextStepButton>
      </ButtonArea>
    </>
  );
}

export default AccountName;
