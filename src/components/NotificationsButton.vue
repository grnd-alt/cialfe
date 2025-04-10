<script lang="ts" setup>
import { getVapiKey } from '@/api/api'
import { useSubscriptionStore } from '@/stores/counter'
import { ref } from 'vue'


const notificationPermission = ref(window.Notification.permission)

const subStore = useSubscriptionStore()
const error = ref<string | null>(null)

const exchangeSubscription = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/service-worker.js', { type: 'module' }).then(serviceWorkerRegistration => {
      getVapiKey().then((res) => {
        if (res.data && res.data.publicKey) {
          serviceWorkerRegistration.pushManager.subscribe({ applicationServerKey: res.data.publicKey, userVisibleOnly: true }).then((subscription) => {
            subStore.setSubscription(subscription)
          })
        }
      })
    }).catch(err => {
      error.value = 'Service worker registration failed: ' + err
    })
    navigator.serviceWorker.controller?.postMessage({ action: 'PING' })
  } else {
    error.value = 'Browser does not support service workers or push messages.'
  }
}

if (notificationPermission.value === 'granted') {
  exchangeSubscription()
}

const enableNotifications = () => {
    window.Notification.requestPermission().then(permission => {
      notificationPermission.value = permission
      if (permission === 'granted') {
        exchangeSubscription()
      } else {
        error.value = 'Notification permission denied.'
      }
    })
  }
</script>
<template>
  <button v-if="notificationPermission !== 'granted'" @click="enableNotifications"> Enable notifications</button>
  <div v-if="error">
    {{ error }}
  </div>
</template>