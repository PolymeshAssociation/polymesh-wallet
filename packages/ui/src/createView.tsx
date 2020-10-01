import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { Fonts, View } from './components';

export default function createView (Entry: React.ComponentType, rootId = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <Suspense fallback='...'>
      <Fonts />
      <View>
        <HashRouter>
          <Entry />
        </HashRouter>
      </View>
    </Suspense>,
    rootElement
  );
}
