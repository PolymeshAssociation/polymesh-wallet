/* eslint-disable sort-keys */
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CDD, IdentityData } from '../../types';

import { createSlice } from '@reduxjs/toolkit';

export interface State {
  currentDids: Record<string, string>; // account: did
  dids: Record<string, IdentityData>; // did: IdentityData
}

const initialState: State = {
  currentDids: {},
  dids: {}
};

interface SetIdentityPayload {
  account: string;
  data: {
    cdd?: CDD;
    did: string;
    priKey: string;
    secKeys: string[];
    msKeys: string[];
  };
}
interface RenameIdentityPayload {
  did: string;
  name: string;
}

const identitiesSlice = createSlice({
  name: 'identities',
  initialState,
  reducers: {
    setIdentity (state, action: PayloadAction<SetIdentityPayload>) {
      const { account, data } = action.payload;
      const currentDid = data.did;

      state.dids[currentDid] = state.dids[currentDid] || {};

      state.dids[currentDid] = Object.assign(state.dids[currentDid], data);
      state.currentDids[account] = currentDid;
    },
    renameIdentity (state, action: PayloadAction<RenameIdentityPayload>) {
      const { did, name } = action.payload;

      state.dids[did].alias = name;
    },
    removeCurrentIdentity (state, action: PayloadAction<string>) {
      delete state.currentDids[action.payload];
    },
    clearCurrentIdentities (state) {
      state.currentDids = {};
    }
  }
});

export const actions = identitiesSlice.actions;

export default identitiesSlice.reducer;
