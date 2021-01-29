import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER, REHYDRATE } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';

import rootReducer from './rootReducer';
import { setIsRehydrated } from './setters';

const isDev = process.env.NODE_ENV === 'development';

const persistConfig = {
  key: 'root',
  storage: localStorage,
  version: 1,
  blacklist: ['status']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [...getDefaultMiddleware({ serializableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
} })];

if (isDev) {
  // middleware.push(logger);
}

const store: any = configureStore({
  middleware,
  reducer: persistedReducer,
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

export const persister = persistStore(store, null, () => {
  setIsRehydrated();
});

export default store;
