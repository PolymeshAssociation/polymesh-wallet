import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = { isReady: boolean };
const initialState: State = { isReady: false };

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setIsReady (state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    }
  }
});

export const actions = statusSlice.actions;

export default statusSlice.reducer;
