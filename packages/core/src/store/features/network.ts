/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultNetwork } from '../../constants';
import { NetworkName } from '../../types';

type State = { selected: NetworkName };
const initialState: State = { selected: defaultNetwork };

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetwork (state, action: PayloadAction<NetworkName>) {
      state.selected = action.payload;
    }
  }
});

export const actions = networkSlice.actions;

export default networkSlice.reducer;
