<script lang="ts" setup>
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon';
import { mdiHome, mdiAccount, mdiPlusCircle } from '@mdi/js';

type NavTarget = 'home' | 'create' | 'me';

const emit = defineEmits<{
  (event: 'refresh-active-route', target: NavTarget): void;
}>();

function handleNavClick(
  event: MouseEvent,
  target: NavTarget,
  isExactActive: boolean,
  navigate: (event?: MouseEvent) => void,
) {
  if (isExactActive) {
    event.preventDefault();
    emit('refresh-active-route', target);
    return;
  }

  navigate(event);
}
</script>
<template>
  <nav class="navbar">
    <router-link to="/" custom v-slot="{ href, navigate, isExactActive }">
      <a
        :href="href"
        :class="{ 'router-link-active': isExactActive }"
        @click="handleNavClick($event, 'home', isExactActive, navigate)"
      >
        <SVGIcon class="nav-icon" type="mdi" :path="mdiHome" size="24" />
      </a>
    </router-link>
    <router-link to="/create" custom v-slot="{ href, navigate, isExactActive }">
      <a
        :href="href"
        :class="{ 'router-link-active': isExactActive }"
        @click="handleNavClick($event, 'create', isExactActive, navigate)"
      >
        <SVGIcon type="mdi" :path="mdiPlusCircle" size="24" />
      </a>
    </router-link>
    <router-link to="/me" custom v-slot="{ href, navigate, isExactActive }">
      <a
        :href="href"
        :class="{ 'router-link-active': isExactActive }"
        @click="handleNavClick($event, 'me', isExactActive, navigate)"
      >
        <SVGIcon type="mdi" :path="mdiAccount" size="24" />
      </a>
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
