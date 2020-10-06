import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = { isReady: boolean, rehydrated: boolean };
const initialState: State = { isReady: false, rehydrated: false };

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setIsReady (state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },
    setRehydrated (state) {
      state.rehydrated = true;
    }
  }
});

export const actions = statusSlice.actions;

export default statusSlice.reducer;
