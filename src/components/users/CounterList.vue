<template>
  <div class="counter-list">
    <div class="counter-header">
      <div class="header-left" @click="isExpanded = !isExpanded">
        <SVGIcon class="collapse-button" type="mdi" :path="isExpanded ? mdiChevronDown : mdiChevronRight" :size="24" />
        <h3 class="header-title">Counters</h3>
      </div>
      <SVGIcon v-if="isMe" @click="showCounterForm = true" class="add-button" type="mdi" :path="mdiPlusCircleOutline" :size="24" />
    </div>
    <div v-if="isExpanded" class="counter-items">
      <div v-for="count in counters" :key="count.ID" class="counter-item">
        <div class="counter-left">
          <div class="counter-icon">{{ count.Icon }}</div>
          <div class="counter-name">{{ count.Name }}</div>
        </div>
        <div class="counter-right">
          <div class="counter-count">{{ count.EntryCount }}</div>
          <SVGIcon v-if="isMe" @click="record(count.ID)" class="add-button" type="mdi" :path="mdiPlusCircleOutline" :size="25" />
        </div>
      </div>
    </div>
    <CounterForm v-if="showCounterForm" @close="showCounterForm=false" @success="onPostAdded"/>
  </div>
</template>
<script lang="ts" setup>
import { addEvent, getCounters } from '@/api/counter';
import type { Counter } from '@/types/Counter';
import { ref, onMounted } from 'vue';
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon';
import { mdiPlusCircleOutline, mdiChevronDown, mdiChevronRight } from '@mdi/js';
import CounterForm from './CounterForm.vue';

const { isMe, userID } = defineProps({
  isMe: {
    type: Boolean,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  }
})

const counters = ref<Counter[]>([])
const showCounterForm = ref(false)
const isExpanded = ref(true)

const onPostAdded = (counter: Counter) => {
  counters.value.push(counter)
  showCounterForm.value = false
}

onMounted(() => {
  getCounters(userID).then((res:Counter[] | null) => {
    if (!res) {
      counters.value = []
      return
    }
    counters.value = res
  }).catch((error) => {
    console.error('Failed to load counters:', error)
  })
})

const record = (id: number) => {
  addEvent(id).then(() => {
    const counter = counters.value.find(c => c.ID === id)
    if (counter) {
      counter.EntryCount += 1
    }
  }).catch((error) => {
    console.error('Failed to add event:', error)
  })
}
</script>
<style scoped>
.counter-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.counter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-bottom: 2px solid var(--background-mid-light);
  cursor: pointer;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 1rem;
}

.collapse-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.counter-items {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 8px 0;
}
.counter-left {
  display: flex;
  align-items: center;
  gap: 9px;
}
.counter-right {
  display: flex;
  align-items: center;
  gap: 9px;
}

.counter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
  padding: 8px;
  background: var(--background-light);
  border-radius: 8px;
}

.counter-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.counter-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.counter-name {
  font-weight: 500;
  color: var(--text);
}

.counter-count {
  font-weight: 700;
  color: var(--primary);
}

.add-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

</style>
