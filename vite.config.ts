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

          manualChunks(id) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('motion') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui';
            }
            // Firebase
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Supabase
            if (id.includes('supabase')) {
              return 'supabase';
            }
            // Three.js (heavy - separate chunk)
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }
            // PDF libraries (heavy - separate chunk)
            if (id.includes('pdfjs-dist') || id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image')) {
              return 'pdf';
            }
            // Other utilities
            if (id.includes('date-fns') || id.includes('fuse.js') || id.includes('mammoth') || id.includes('react-to-print')) {
              return 'utils';
            }
            // EmailJS
            if (id.includes('emailjs')) {
              return 'emailjs';
            }
            // React icons
            if (id.includes('react-icons')) {
              return 'icons';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },

      chunkSizeWarningLimit: 500,

      sourcemap: isProduction ? false : true,

      minify: isProduction ? 'terser' : false,

      terserOptions: {

        compress: {

          drop_console: isProduction,

          drop_debugger: isProduction,

          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : []

        },

        mangle: {

          safari10: true

        }

      },

      reportCompressedSize: true,

      cssCodeSplit: true

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

