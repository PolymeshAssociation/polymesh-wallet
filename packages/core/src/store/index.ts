import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import { localStorage } from 'redux-persist-webextension-storage';
import { persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: localStorage,
  version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [...getDefaultMiddleware({ serializableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
} })];

if (process.env.NODE_ENV === 'development' && logger) {
  middleware.push(logger);
}

const store: any = configureStore({ middleware, reducer: persistedReducer });

// Reducer hot module reloading
if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;

    store.replaceReducer(newRootReducer);
  });
}

export type Dispatch = typeof store.dispatch

export const persister = persistStore(store);

export default store;
