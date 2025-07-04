import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { makeRouter } from './router'
import { initKeycloak } from './services/keycloak'

const app = createApp(App)

initKeycloak().then(() => {
  app.use(createPinia())
  app.use(makeRouter())

  app.mount('#app')
})
