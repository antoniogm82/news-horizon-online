import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle size and performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          editor: ['@tiptap/react', '@tiptap/starter-kit'],
          supabase: ['@supabase/supabase-js', '@tanstack/react-query'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    // Enhanced minification for production
    ...(mode === 'production' && {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
      },
    }),
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
  },
}));
