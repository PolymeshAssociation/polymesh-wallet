import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Fonts, View, ErrorFallback } from './components';

export default function createView (Entry: React.ComponentType, rootId = 'root'): void {
  // @FIXME dirty hack
  // First thing, we set window size because the default window size is too wide.
  // There's hardly any clean way to accomplish this, since window size is set initially
  // via chrome.windows.create, which is invoked by Polkadot's singing request handling.
  window.resizeTo(328, 600);

  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <Suspense fallback='...'>
      <Fonts />
      <View>
        <HashRouter>

          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              window.location.hash = '/';
            }}
          >
            <Entry />
          </ErrorBoundary>
        </HashRouter>
      </View>
    </Suspense>,
    rootElement
  );
}
