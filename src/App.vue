<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { isAuthenticated, login, logout, keycloak } from './services/keycloak'
</script>

<template>
  <header>
    <div class="account-section">
      <a :href="keycloak.createAccountUrl()">
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
