import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { defaultNetwork, defaultSs58Format } from '../../constants';
import { NetworkName, NetworkState } from '../../types';

const initialState: NetworkState = {
  selected: defaultNetwork,
  ss58Format: defaultSs58Format,
  isDeveloper: false,
  customNetworkUrl: ''
};

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
