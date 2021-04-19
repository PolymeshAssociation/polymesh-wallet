import { combineReducers } from '@reduxjs/toolkit';

import accounts from './features/accounts';
import identities from './features/identities';
import network from './features/network';
import status from './features/status';

const appReducer = combineReducers({
  accounts,
  identities,
  network,
  status
});

export type RootState = ReturnType<typeof appReducer>;
export type AppReducer = typeof appReducer;
export default appReducer;
