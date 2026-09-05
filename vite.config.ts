import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  /* En GitHub Pages el sitio cuelga de /Ulises-landing/, no de la raíz del
     dominio. Solo en build: en dev seguimos sirviendo desde /. */
  base: command === 'build' ? '/Ulises-landing/' : '/',
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
}))
