import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultNetwork } from '../../constants';
import { NetworkName } from '../../types';

type State = { selected: NetworkName, isDeveloper: boolean };
const initialState: State = { selected: defaultNetwork, isDeveloper: false };

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
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
