/**
 * App entry. Wires Vue + Router + global stylesheet, then mounts.
 *
 * Default landing is /lobby (defined in router/index.ts) so the
 * sample page is what shows up first on `npm run dev`.
 */
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

createApp(App).use(router).mount('#app')
