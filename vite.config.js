import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/3d-ing/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        platonic: resolve(__dirname, 'platonic.html'),
        simulator: resolve(__dirname, 'simulator.html'),
        orbit: resolve(__dirname, 'orbit.html'),
        snake: resolve(__dirname, 'snake.html'),
      }
    }
  }
})
