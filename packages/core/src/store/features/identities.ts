/* eslint-disable sort-keys */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

import { CDD, IdentityData, NetworkName, UID } from '../../types';
import { initialFeatureState } from '../utils';

type State = Record<NetworkName, Record<string, IdentityData>>;
const initialState: State = initialFeatureState() as Record<NetworkName, Record<string, IdentityData>>;

type SetIdentityPayload = { network: NetworkName, data: IdentityData };
type RemoveIdentityPayload = { network: NetworkName, did: string };
type RenameIdentityPayload = { network: NetworkName, did: string, name: string };
type SetIdentityCddPayload = { network: NetworkName, did: string, cdd?: CDD };
type SetIdentityUidPayload = { network: NetworkName, did: string, uid?: UID };

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
    },
    setIdentityUid (state, { payload: { did, network, uid } }: PayloadAction<SetIdentityUidPayload>) {
      state[network][did].uid = uid;
    }
  }
});

export const actions = identitiesSlice.actions;

export default identitiesSlice.reducer;
