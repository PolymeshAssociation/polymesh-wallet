import { Error, StoreStatus } from '@polymathnetwork/extension-core/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StoreStatus = { isReady: false, rehydrated: false, error: null };

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setIsReady (state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
      state.error = null;
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
