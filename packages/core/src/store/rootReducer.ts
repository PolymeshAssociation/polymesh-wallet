import {
  ActionFromReducersMapObject,
  combineReducers,
  Reducer,
  StateFromReducersMapObject,
} from '@reduxjs/toolkit';

import accounts from './features/accounts';
import identities from './features/identities';
import network from './features/network';
import status from './features/status';

const reducers = { accounts, identities, network, status };

type ReducersMapObject = typeof reducers;

const appReducer: Reducer<
  StateFromReducersMapObject<ReducersMapObject>,
  ActionFromReducersMapObject<ReducersMapObject>
> = combineReducers(reducers);

export type RootState = ReturnType<typeof appReducer>;
export type AppReducer = typeof appReducer;
export default appReducer;
