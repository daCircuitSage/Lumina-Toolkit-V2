/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export function render(url: string) {
  const helmetContext = {};

  // Use MemoryRouter to simulate the URL for SSR
  // This allows SeoHead to generate correct canonical URLs based on the route
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[url]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>
  );

  const helmet = helmetContext as any;

  return {
    html,
    helmet: {
      title: helmet.title?.toString() || '',
      meta: helmet.meta?.toString() || '',
      link: helmet.link?.toString() || '',
      script: helmet.script?.toString() || '',
    }
  };
}
