import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { HashRouter } from 'react-router-dom';

import { ErrorFallback, View } from './components';

const onReset = () => {
  window.location.hash = '/';
};

export default function createView (
  Entry: React.ComponentType,
  rootId = 'root'
): void {
  // @FIXME dirty hack
  // First thing, we set window size because the default window size is too wide.
  // There's hardly any clean way to accomplish this, since window size is set initially
  // via chrome.windows.create, which is invoked by Polkadot's singing request handling.
  const targetInnerWidth = 400;
  const targetInnerHeight = 600;

  if (
    window.innerWidth !== targetInnerWidth ||
    window.innerHeight !== targetInnerHeight
  ) {
    const newOuterWidth =
      targetInnerWidth + (window.outerWidth - window.innerWidth);
    const newOuterHeight =
      targetInnerHeight + (window.outerHeight - window.innerHeight);

    window.resizeTo(newOuterWidth, newOuterHeight);
  }

  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  createRoot(rootElement).render(
    <Suspense fallback='...'>
      <View>
        <HashRouter>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={onReset}
          >
            <Entry />
          </ErrorBoundary>
        </HashRouter>
      </View>
    </Suspense>
  );
}
