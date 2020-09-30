import { combineReducers } from '@reduxjs/toolkit';
import accounts from './features/accounts';
import identities from './features/identities';
import network from './features/network';
import status from './features/status';

const rootReducer = combineReducers({
  accounts,
  identities,
  network,
  status
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
