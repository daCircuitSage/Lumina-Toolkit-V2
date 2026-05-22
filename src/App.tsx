/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */



import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';

import { DatabaseProvider } from './contexts/DatabaseContext';

import AppRoutes from './routes/AppRoutes';



export default function App() {

  return (

    <ThemeProvider>

      <BrowserRouter>

        <DatabaseProvider>

          <AppRoutes />

        </DatabaseProvider>

      </BrowserRouter>

    </ThemeProvider>

  );

}



