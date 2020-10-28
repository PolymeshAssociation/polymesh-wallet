import { Error, StoreStatus } from '@polymathnetwork/extension-core/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StoreStatus = { rehydrated: false, error: null, ready: false };

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    init (state) {
      state.ready = false;
    },
    isReady (state) {
      state.error = null;
      state.ready = true;
    },
    setRehydrated (state) {
      state.rehydrated = true;
    },
    error (state, action: PayloadAction<Error | null>) {
      state.error = action.payload;
    }
  }
});

export const actions = statusSlice.actions;

export default statusSlice.reducer;
