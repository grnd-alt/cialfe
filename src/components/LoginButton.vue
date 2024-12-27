<script setup lang="ts">
import { keycloak } from '@/services/keycloak'
import { ref } from 'vue'
const loginUrl = ref('')
keycloak.createLoginUrl().then((url) => {
  loginUrl.value = url
})
</script>
<template>
  <a
    :href="loginUrl"
  >
    login
  </a>
</template>
