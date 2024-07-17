/* global chrome */

import { checkForUpdateAndMigrate } from './migrations';

/*
 This is placed in a separate file to ensure that the listener is registered immediately,
 avoiding any delays caused by other imports or initializations. When placed in background.ts
 it was not being registered before the event was emitted.
*/

chrome.runtime.onInstalled.addListener((details) => {
  checkForUpdateAndMigrate(details).catch(console.error);
});
