<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { isAuthenticated, login, logout, keycloak } from './services/keycloak'
import { useSubscriptionStore } from './stores/counter'
import { getVapiKey } from './api/api'

window.Notification.requestPermission()

const subStore = useSubscriptionStore()

if ('serviceWorker' in navigator && 'PushManager' in window) {
  getVapiKey().then((res) => {
    if (res.data && res.data.publicKey) {
      navigator.serviceWorker.register('/service-worker.js', { type: 'module' }).then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.subscribe({ applicationServerKey: res.data.publicKey, userVisibleOnly: true}).then((subscription) => {
          subStore.setSubscription(subscription)
        })
      }).catch(error => {
        console.error('An error occurred while registering the service worker.');
        console.error(error);
      });
      navigator.serviceWorker.controller?.postMessage({ action: 'PING' })

    }
  })
} else {
  console.error('Browser does not support service workers or push messages.');
}
</script>

<template>
  <header>
    <div class="account-section">
      <a :href="keycloak.createAccountUrl({ redirectUri: $router.currentRoute.value.fullPath })">
        <SVGIcon type="mdi" :path="mdiAccount" :size="32" />
      </a>
      <button v-if="!isAuthenticated()" @click="login">Login</button>
      <button v-else @click="logout">Logout</button>
    </div>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/me">Account</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
