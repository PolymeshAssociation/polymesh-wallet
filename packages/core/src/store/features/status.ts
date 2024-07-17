import type { PayloadAction } from '@reduxjs/toolkit';
import type { Error, NetworkName, StoreStatus } from '@polymeshassociation/extension-core/types';

import { createSlice } from '@reduxjs/toolkit';

const initialState: StoreStatus = {
  apiStatus: 'connecting',
  error: null,
  populated: {}
};

const statusSlice = createSlice({
  initialState,
  name: 'status',
  reducers: {
    apiError (state) {
      state.apiStatus = 'error';
    },
    apiReady (state) {
      state.error = null;
      state.apiStatus = 'ready';
    },
    error (state, action: PayloadAction<Error | null>) {
      state.error = action.payload ? action.payload : null;
    },
    init (state) {
      state.error = null;
      state.apiStatus = 'connecting';
    },
    populated (state, action: PayloadAction<NetworkName>) {
      state.populated[action.payload] = true;
    }
  }
});

export const actions = statusSlice.actions;

export default statusSlice.reducer;
