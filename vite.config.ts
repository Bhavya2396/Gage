import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'esnext',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          // Separate the heavy 3D libraries
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          // Keep Mountain3D in its own chunk
          mountain3d: ['src/components/mountain/Mountain3D.tsx'],
          // Weather effects in separate chunk
          weather: [
            'src/components/mountain/WeatherEffects.tsx',
            'src/components/mountain/VolumetricClouds.tsx',
            'src/components/mountain/FogPlane.tsx'
          ]
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        }
      }
    },
    // Optimize for faster builds
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  }
})

