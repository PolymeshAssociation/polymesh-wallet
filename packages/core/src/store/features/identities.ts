/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CDD, IdentityData, NetworkName } from '../../types';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

type State = Record<NetworkName, Record<string, IdentityData>>;
const initialState: State = {
  [NetworkName.alcyone]: {},
  [NetworkName.pmf]: {}
};

type SetIdentityPayload = { network: NetworkName, data: IdentityData };
type RemoveIdentityPayload = { network: NetworkName, did: string };
type RenameIdentityPayload = { network: NetworkName, did: string, name: string };
type SetIdentityCddPayload = { network: NetworkName, did: string, cdd?: CDD };

const identitiesSlice = createSlice({
  name: 'identities',
  initialState,
  reducers: {
    setIdentity (state, action: PayloadAction<SetIdentityPayload>) {
      const { data, network } = action.payload;
      const prev = state[network][data.did];

      if (!isEqual(prev, data)) {
        state[network][data.did] = merge(prev, data);
      }
    },
    removeIdentity (state, action: PayloadAction<RemoveIdentityPayload>) {
      const { did, network } = action.payload;

      delete state[network][did];
    },
    renameIdentity (state, action: PayloadAction<RenameIdentityPayload>) {
      const { did, name, network } = action.payload;

      state[network][did].alias = name;
    },
    setIdentityCdd (state, { payload: { cdd, did, network } }: PayloadAction<SetIdentityCddPayload>) {
      state[network][did].cdd = cdd;
    }
  }
});

export const actions = identitiesSlice.actions;

export default identitiesSlice.reducer;
