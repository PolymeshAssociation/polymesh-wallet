/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CDD, IdentityData, NetworkName, UID } from '../../types';
import { initialFeatureState } from '../utils';

type State = Record<NetworkName, Record<string, IdentityData>>;
const initialState: State = initialFeatureState() as Record<NetworkName, Record<string, IdentityData>>;

type SetIdentityPayload = { network: NetworkName, did: string, data: {
  did: string,
  priKey: string,
  secKeys: string[]
}};
type SetIdentityCddPayload = { network: NetworkName, did: string, cdd?: CDD };
type RemoveIdentityPayload = { network: NetworkName, did: string };
type RenameIdentityPayload = { network: NetworkName, did: string, name: string };
type SetIdentityUidPayload = { network: NetworkName, did: string, uid?: UID };

const identitiesSlice = createSlice({
  name: 'identities',
  initialState,
  reducers: {
    setIdentity (state, action: PayloadAction<SetIdentityPayload>) {
      const { data, did, network } = action.payload;

      state[network][did] = state[network][did] || {};

      state[network][did] = Object.assign(state[network][did], data);
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
    },
    setIdentityUid (state, { payload: { did, network, uid } }: PayloadAction<SetIdentityUidPayload>) {
      state[network][did].uid = uid;
    }
  }
});

export const actions = identitiesSlice.actions;

export default identitiesSlice.reducer;
