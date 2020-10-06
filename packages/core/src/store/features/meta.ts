import { createSlice } from '@reduxjs/toolkit';

type State = { rehydrated: boolean };
const initialState: State = { rehydrated: false };

const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setRehydrated (state) {
      state.rehydrated = true;
    }
  }
});

export const actions = metaSlice.actions;

export default metaSlice.reducer;
