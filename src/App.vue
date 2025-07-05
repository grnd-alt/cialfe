<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationsButton from './components/NotificationsButton.vue'
import NavBar from './components/NavBar.vue'

window.addEventListener('load', function () {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope)
  }).catch((error) => {
    console.error('Service Worker registration failed:', error)
  })
})


const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

</script>

<template>
  <header>
    <div class="account-section">
      <NotificationsButton />
    </div>
  </header>
  <main class="main-content">
    <RouterView />
  </main>
  <footer>
    <NavBar />
  </footer>
</template>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

:host {
  height: 100%;
}

body {
  min-height: 100vh;
}

.main-content {
  flex: 1;
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 4rem;
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  flex-shrink: 0;
  margin-top: auto;
  width: 100%;
  height: 3.5rem;
  /* Optional: add background or border for visibility */
  /* background: var(--background-light); */
  /* border-top: 1px solid #eee; */
}
</style>
