import type { Middleware } from '@reduxjs/toolkit';
import type { PersistConfig, Storage } from 'redux-persist';
import type { RootState } from './rootReducer';

import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { localStorage } from 'redux-persist-webextension-storage';

import rootReducer from './rootReducer';

const persistConfig: PersistConfig<RootState> = {
  blacklist: ['status'],
  key: 'root',
  stateReconciler: autoMergeLevel2,
  storage: localStorage as Storage,
  version: 1
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    const middlewares: Middleware[] = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    });

    return middlewares;
  },
  reducer: persistedReducer
});

export type Dispatch = typeof store.dispatch;

export const persister = persistStore(store);

export default store;
