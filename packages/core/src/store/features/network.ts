import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { defaultSs58Format, defaultNetworkState } from '../../constants';
import { NetworkName } from '../../types';

const initialState = defaultNetworkState;

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<NetworkName>) {
      state.selected = action.payload;
    },
    setFormat(state, action: PayloadAction<number | undefined>) {
      state.ss58Format = action.payload || defaultSs58Format;
    },
    toggleIsDeveloper(state) {
      state.isDeveloper = !state.isDeveloper;
    },
    setCustomNetworkUrl(state, action: PayloadAction<string>) {
      state.customNetworkUrl = action.payload;
    }
  },
});

export const actions = networkSlice.actions;

export default networkSlice.reducer;
