import tailwindcss from '@tailwindcss/vite';

import react from '@vitejs/plugin-react';

import path from 'path';

import {defineConfig, loadEnv} from 'vite';

// Temporarily disabled vite-plugin-prerender due to dependency issues
// We'll use the standalone prerender.cjs script instead
// import prerender from 'vite-plugin-prerender';



export default defineConfig(({mode}) => {

  const env = loadEnv(mode, '.', '');

  const isProduction = mode === 'production';

  

  return {

    plugins: [

      react(),

      tailwindcss()

      // Prerender plugin disabled - using standalone prerender.cjs script instead
      // prerender({
      //   routes: [
      //     '/',
      //     '/all-tools',
      //     '/resume-builder',
      //     '/ats-resume-checker',
      //     '/cover-letter-generator',
      //     '/job-tracker',
      //     '/interview-prep',
      //     '/pdf-converter',
      //     '/ai-assistant',
      //     '/ai-caption-generator',
      //     '/youtube-title-generator',
      //     '/age-calculator',
      //     '/gpa-calculator',
      //     '/contact',
      //     '/profile'
      //   ],
      //   renderer: (url) => {
      //     return new Promise((resolve, reject) => {
      //       // Dynamic import to avoid issues during build
      //       // Use the new SSR entry point that properly renders Helmet tags
      //       import('./src/entry-server.tsx').then(({ render }) => {
      //         const result = render(url);
      //         // The vite-plugin-prerender expects just the HTML string
      //         resolve(result.html);
      //       }).catch(reject);
      //     });
      //   },
      //   rendererOptions: {
      //     headless: true,
      //     timeout: 30000
      //   }
      // })

    ],

    base: isProduction ? '/' : '/',

    define: {

      'process.env.MISTRAL_API_KEY': JSON.stringify(env.MISTRAL_API_KEY),

      // VITE_ variables are automatically exposed by Vite, no manual definition needed

    },

    resolve: {

      alias: {

        '@': path.resolve(__dirname, '.'),

      },

    },

    build: {

      rollupOptions: {

        output: {

          manualChunks: {

            vendor: ['react', 'react-dom'],

            router: ['react-router-dom'],

            ui: ['lucide-react', 'motion', 'clsx', 'tailwind-merge'],

            utils: ['date-fns', 'fuse.js', 'html-to-image', 'html2canvas', 'jspdf', 'mammoth', 'pdfjs-dist', 'react-to-print']

          }

        }

      },

      chunkSizeWarningLimit: 1000,

      sourcemap: isProduction ? false : true,

      minify: isProduction ? 'terser' : false,

      terserOptions: {

        compress: {

          drop_console: false,

          drop_debugger: isProduction

        }

      }

    },

    server: {

      // HMR is disabled in AI Studio via DISABLE_HMR env var.

      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.

      hmr: process.env.DISABLE_HMR !== 'true',

    },

    preview: {

      port: 4173,

      strictPort: true

    }

  };

});

