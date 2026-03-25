<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NotificationsButton from './components/NotificationsButton.vue'
import NavBar from './components/NavBar.vue'
import { isAuthReady } from './services/keycloak'

type NavTarget = 'home' | 'create' | 'me'

const route = useRoute()
const defaultKeepAliveInclude = ['HomeView', 'UserView']
const keepAliveInclude = ref([...defaultKeepAliveInclude])
const refreshTokens = ref<Record<NavTarget, number>>({
  home: 0,
  create: 0,
  me: 0,
})

// need this so the component changes and re-renders
const componentRenderKey = computed(() => {
  const routeName = String(route.name ?? 'unknown')
  const token = route.name === 'home'
    ? refreshTokens.value.home
    : route.name === 'create'
      ? refreshTokens.value.create
      : route.name === 'me'
        ? refreshTokens.value.me
        : 0

  return `${routeName}:${route.path}:${token}`
})

async function handleRefreshActiveRoute(target: NavTarget) {
  refreshTokens.value[target] += 1

  const keepAliveNameByTarget: Record<NavTarget, string | undefined> = {
    home: 'HomeView',
    create: undefined,
    me: 'UserView',
  }

  const componentName = keepAliveNameByTarget[target]
  if (!componentName) {
    return
  }

  keepAliveInclude.value = defaultKeepAliveInclude.filter((name) => name !== componentName)
  await nextTick()
  keepAliveInclude.value = [...defaultKeepAliveInclude]
}

onMounted(() => {
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
  <div v-if="!isAuthReady" class="loading-screen">Loading...</div>
  <template v-else>
  <header>
    <div class="account-section">
      <NotificationsButton />
    </div>
  </header>
  <main class="main-content">
      <RouterView v-slot="{Component}">
        <KeepAlive :include="keepAliveInclude">
          <component :is="Component" :key="componentRenderKey" />
        </KeepAlive>
      </RouterView>
  </main>
  <footer>
    <NavBar @refresh-active-route="handleRefreshActiveRoute" />
  </footer>
  </template>
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
}
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
