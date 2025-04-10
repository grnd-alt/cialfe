<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { isAuthenticated, login, logout, keycloak } from './services/keycloak'
import NotificationsButton from './components/NotificationsButton.vue'

</script>

<template>
  <header>
    <div class="account-section">
      <a :href="keycloak.createAccountUrl({ redirectUri: $router.currentRoute.value.fullPath })">
        <SVGIcon type="mdi" :path="mdiAccount" :size="32" />
      </a>
      <button v-if="!isAuthenticated()" @click="login">Login</button>
      <button v-else @click="logout">Logout</button>
      <NotificationsButton />
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
