import type { PayloadAction } from '@reduxjs/toolkit';
import type { AccountData } from '../../types';

import { createSlice } from '@reduxjs/toolkit';
import merge from 'lodash/merge';
import isEqual from 'lodash-es/isEqual';

export interface AccountsState { selected?: string; keys: Record<string, AccountData> }
const initialState: AccountsState = {
  keys: {}
} as AccountsState;

const accountsSlice = createSlice({
  initialState,
  name: 'accounts',
  reducers: {
    removeAccount (state, action: PayloadAction<string>) {
      const address = action.payload;

      delete state.keys[address];

      if (state.selected === address) {
        state.selected = undefined;
      }
    },
    selectAccount (state, action: PayloadAction<string>) {
      state.selected = action.payload;
    },
    setAccount (state, action: PayloadAction<AccountData>) {
      const data = action.payload;
      const prev = state.keys[data.address];
      const next = merge(prev, data);

      if (!isEqual(next, prev)) {
        state.keys[data.address] = next;
      }
    }
  }
});

export const actions = accountsSlice.actions;

export default accountsSlice.reducer;
