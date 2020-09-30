/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash/merge';

import { AccountData, NetworkName } from '../../types';
type State = {selected?: string} & Record<NetworkName, Record<string, AccountData>>;
const initialState: State = {
  [NetworkName.pmf]: {},
  [NetworkName.alcyone]: {}
};

type SetAccountPayload = { network: NetworkName, data: AccountData };
type RemoveAccountPayload = { network: NetworkName, address: string };
type SelectAccountPayload = string;

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccount (state, action: PayloadAction<SetAccountPayload>) {
      const { data, network } = action.payload;
      const prev = state[network][data.address];
      const next = merge(prev, data);

      if (!isEqual(next, prev)) {
        state[network][data.address] = next;
      }
    },
    removeAccount (state, action: PayloadAction<RemoveAccountPayload>) {
      const { address, network } = action.payload;

      delete state[network][address];
    },
    selectAccount (state, action: PayloadAction<SelectAccountPayload>) {
      state.selected = action.payload;
    }
  }
});

export const actions = accountsSlice.actions;

export default accountsSlice.reducer;
