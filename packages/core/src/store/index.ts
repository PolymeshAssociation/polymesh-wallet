import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { localStorage } from 'redux-persist-webextension-storage';

import rootReducer, { AppReducer, RootState } from './rootReducer';

const isDev = process.env.NODE_ENV === 'development';

const persistConfig = {
  key: 'root',
  storage: localStorage,
  version: 1,
  blacklist: ['status'],
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const middleware = [...getDefaultMiddleware({ serializableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
} })];

if (isDev) {
  middleware.push(logger);
}

const store = configureStore({
  middleware,
  reducer: persistedReducer as unknown as AppReducer,
  devTools: isDev
});

// Reducer hot module reloading
if (isDev && (module as any).hot) {
  (module as any).accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;

    store.replaceReducer(newRootReducer);
  });
}

export type Dispatch = typeof store.dispatch

export const persister = persistStore(store);

export default store;
