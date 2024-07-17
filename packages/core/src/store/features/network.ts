import type { PayloadAction } from '@reduxjs/toolkit';
import type { NetworkName } from '../../types';

import { createSlice } from '@reduxjs/toolkit';

import { defaultNetworkState, defaultSs58Format } from '../../constants';

const initialState = defaultNetworkState;

const networkSlice = createSlice({
  initialState,
  name: 'network',
  reducers: {
    setCustomNetworkUrl (state, action: PayloadAction<string>) {
      state.customNetworkUrl = action.payload;
    },
    setFormat (state, action: PayloadAction<number | undefined>) {
      state.ss58Format = action.payload || defaultSs58Format;
    },
    setNetwork (state, action: PayloadAction<NetworkName>) {
      state.selected = action.payload;
    },
    toggleIsDeveloper (state) {
      state.isDeveloper = !state.isDeveloper;
    }
  }
});

export const actions = networkSlice.actions;

export default networkSlice.reducer;
