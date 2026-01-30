<template>
  <div class="user-search" ref="root">
    <input
      type="text"
      v-model="query"
      @keydown="onKeydown"
      @focus="openDropdown"
      placeholder="Search users..."
      aria-autocomplete="list"
      autocomplete="off"
    />

    <ul v-if="showDropdown" class="dropdown" role="listbox">
      <li v-if="loading" class="loading">Loading...</li>
      <li
        v-for="(user, index) in users"
        :key="user.UserID"
        :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="selectUser(user)"
        role="option"
        :aria-selected="index === highlightedIndex"
      >
        {{ user.Username }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { findUsers } from '@/api/api';
import type { UserSearchResult } from '@/types/User';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const query = ref('');
const users = ref<UserSearchResult[]>([]);
const loading = ref(false);
const showDropdown = ref(false);
const highlightedIndex = ref(-1);
const root = ref<HTMLElement | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const emit = defineEmits(['select']);

function openDropdown() {
  showDropdown.value = true;
}

function closeDropdown() {
  showDropdown.value = false;
  highlightedIndex.value = -1;
}

watch(query, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (!newQuery) {
    users.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      const newUsers = await findUsers(newQuery);
      users.value = newUsers || [];
    } finally {
      loading.value = false;
    }
  }, 300);
});

function selectUser(user: UserSearchResult) {
  query.value = user.Username;
  emit('select', user);
  closeDropdown();
}

function onKeydown(e: KeyboardEvent) {
  if (!showDropdown.value) openDropdown();
  switch (e.key) {
    case 'ArrowDown':
      if (users.value.length) {
        highlightedIndex.value = (highlightedIndex.value + 1) % users.value.length;
        e.preventDefault();
      }
      break;
    case 'ArrowUp':
      if (users.value.length) {
        highlightedIndex.value = (highlightedIndex.value - 1 + users.value.length) % users.value.length;
        e.preventDefault();
      }
      break;
    case 'Enter':
      if (highlightedIndex.value >= 0 && users.value[highlightedIndex.value]) {
        selectUser(users.value[highlightedIndex.value]);
        e.preventDefault();
      }
      break;
    case 'Escape':
      closeDropdown();
      break;
  }
}

function onClickOutside(e: MouseEvent) {
  if (!root.value) return;
  if (!(e.target instanceof Node)) return;
  if (!root.value.contains(e.target)) closeDropdown();
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
.user-search { position: relative; width: 260px; color: var(--color); }
input { width: 100%; padding: 8px; box-sizing: border-box; background: var(--background); }
.dropdown { position: absolute; left: 0; right: 0; margin: 0; padding: 0; list-style: none; background: var(--background);; max-height: 240px; overflow: auto; z-index: 10; }
.dropdown li { padding: 8px; cursor: pointer; }
.dropdown li.highlighted { background: var(--background); color: var(--color);}
</style>
