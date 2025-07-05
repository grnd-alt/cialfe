<script lang="ts" setup>
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon';
import { mdiHome, mdiAccount, mdiPlusCircle } from '@mdi/js';
</script>
<template>
  <nav class="navbar">
    <router-link to="/" activeClass="router-link-active">
      <SVGIcon class="nav-icon" type="mdi" :path="mdiHome" size="24" />
    </router-link>
    <router-link to="/create" activeClass="router-link-active">
      <SVGIcon type="mdi" :path="mdiPlusCircle" size="24" />
    </router-link>
    <router-link to="/me" activeClass="router-link-active">
      <SVGIcon type="mdi" :path="mdiAccount" size="24" />
    </router-link>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--background-mid-light);
  border-top: 2px solid var(--primary);
  align-items: center;
  /* padding: 1rem; */
  /* background-color: var(--background); */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;

  a {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    /* height: 100%; */
  }

  :not(:first-child) {
    border-left: 1px solid var(--text);
  }
  a.router-link-active :deep(path) {
    color: var(--primary);
  }
}
</style>
