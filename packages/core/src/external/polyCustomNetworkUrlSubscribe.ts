import { Unsubscribe } from '@reduxjs/toolkit';

import reduxSubscribe from '../store/reduxSubscribe';
import { customNetworkUrl } from '../store/selectors';

export default function (cb: (networkUrl: string) => void): Unsubscribe {
  const innerCb = (networkUrl: string) => {
    cb(networkUrl);
  };
  return reduxSubscribe(customNetworkUrl, innerCb);
}
