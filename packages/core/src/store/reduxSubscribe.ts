import { Unsubscribe } from '@reduxjs/toolkit';
import { isEqual } from 'lodash-es';
import store from '.';
import { RootState } from './rootReducer';

/**
 * A generic redux store subscription function.
 * @param selector a selector function to select a state branch.
 * @param cb a callback that will be called once the selected state branch has changed.
 */
function reduxSubscribe<P> (selector: (state: RootState) => P, cb: (data: P) => void): Unsubscribe {
  let currentState: P;

  function storeListener () {
    const nextState: P = selector(store.getState());

    if (!isEqual(nextState, currentState)) {
      currentState = nextState;
      cb(currentState);
    }
  }

  const unsubscribe = store.subscribe(storeListener);

  storeListener();

  return unsubscribe;
}

export default reduxSubscribe;
