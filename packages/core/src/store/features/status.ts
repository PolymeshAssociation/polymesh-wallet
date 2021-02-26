import { Error, NetworkName, StoreStatus } from '@polymathnetwork/extension-core/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StoreStatus = { rehydrated: false, error: null, ready: false, populated: {} };

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    init (state) {
      state.ready = false;
    },
    apiReady (state) {
      state.error = null;
      state.ready = true;
    },
    setRehydrated (state) {
      state.rehydrated = true;
    },
    populated (state, action: PayloadAction<NetworkName>) {
      state.populated[action.payload] = true;
    },
    error (state, action: PayloadAction<Error | null>) {
      state.error = action.payload ? action.payload : null;
    }
  }
});

export const actions = statusSlice.actions;

export default statusSlice.reducer;
