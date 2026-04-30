import type { HexString } from '@polkadot/util/types';
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
    setGenesisHash (state, action: PayloadAction<HexString | undefined>) {
      state.genesisHash = action.payload;
    },
    // TODO: Remove this action once the wallet no longer needs a temporary v7 compatibility path.
    setIsV8 (state, action: PayloadAction<boolean>) {
      state.isV8 = action.payload;
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

export const { setIsV8 } = networkSlice.actions;

export default networkSlice.reducer;
