import { AnyAction, combineReducers } from '@reduxjs/toolkit';

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

const rootReducer = (state: RootState, action: AnyAction): typeof appReducer => {
  if (action.type === 'RESET') {
    // @ts-ignore
    state = undefined;
  }

  return appReducer(state, action) as unknown as typeof appReducer;
};

export type RootState = ReturnType<typeof appReducer>;
export default rootReducer as unknown as typeof appReducer;
