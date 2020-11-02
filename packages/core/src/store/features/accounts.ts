/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash/merge';
import { AccountData, NetworkName } from '../../types';
import { initialFeatureState } from '../utils';

type State = {selected?: string} & Record<NetworkName, Record<string, AccountData>>;
const initialState: State = initialFeatureState() as Record<NetworkName, Record<string, AccountData>>;

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

      if (state.selected === address) {
        state.selected = undefined;
      }
    },
    selectAccount (state, action: PayloadAction<SelectAccountPayload>) {
      state.selected = action.payload;
    },
    setAccountGlobally (state, action: PayloadAction<AccountData>) {
      const data = action.payload;

      Object.keys(NetworkName).forEach((network: string) => {
        const prev = state[network as NetworkName][data.address];
        const next = merge(prev, data);

        if (!isEqual(next, prev)) {
          state[network as NetworkName][data.address] = next;
        }
      });
    },
    removeAccountGlobally (state, action: PayloadAction<string>) {
      const address = action.payload;

      Object.keys(NetworkName).forEach((network: string) => {
        const prev = state[network as NetworkName][address];

        if (prev) {
          delete state[network as NetworkName][address];
        }
      });

      if (state.selected === address) {
        state.selected = undefined;
      }
    }
  }
});

export const actions = accountsSlice.actions;

export default accountsSlice.reducer;
