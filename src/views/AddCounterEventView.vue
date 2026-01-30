<template>
  <div>
    <p v-if="loading">Adding event and fetching count...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div v-else>
      <h1>{{counter?.counter.Icon}} {{ counter?.counter.Name }}</h1>
      <div v-for="user in counter?.users" :key="user.UserID">
        <p>{{ user.Username }}: {{ user.EntryCount ?? 0 }}</p>
      </div>
    </div>
  </div>
</template>
<script lang ="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { addEvent, getCounter } from '@/api/counter';
import type { Counter } from '@/types/Counter';

const route = useRoute();
const counterID = Number(route.params.counterID);

const counter = ref<Counter | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

async function fetchCounter() {
  loading.value = true;
  error.value = null;
  try {
    const res = await getCounter(counterID);
    counter.value = res;
  } catch (e) {
    console.error('Failed to fetch counter:', e);
    error.value = (e as Error)?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    await addEvent(counterID);
    await fetchCounter();
  } catch (e) {
    console.error('Failed to add event:', e);
    error.value = (e as Error)?.message ?? String(e);
    loading.value = false;
  }
});
</script>
