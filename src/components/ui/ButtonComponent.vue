<script setup lang="ts">
</script>

<template>
  <button>
    <slot />
  </button>
</template>

<style scoped>
button {
  background: var(--primary);
  border: 2px solid var(--primary-dark);
  font-size: 17px;
  outline: none;
  cursor: pointer;
}
</style>
