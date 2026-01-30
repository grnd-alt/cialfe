<template>
  <ModalComponent @close="$emit('close')">
    <div class="counter-form">
      <h3 class="form-header">Create new counter</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group form-group-icon">
            <label>Icon</label>
            <div class="icon-selector">
              <button
                type="button"
                @click="showPicker = !showPicker"
                class="icon-button"
              >
                <span class="selected-icon">{{ selectedIcon }}</span>
              </button>
              <EmojiPicker
                v-if="showPicker"
                :native="true"
                @select="onEmojiSelect"
                class="emoji-picker"
                :theme="theme"
              />
            </div>
          </div>

          <div class="form-group form-group-name">
            <label for="counter-name">Counter name</label>
            <input
              id="counter-name"
              v-model="counterName"
              type="text"
              placeholder="e.g., Coffee, Workouts"
              class="form-input"
              required
            />
          </div>
        </div>
        <div class="form-row">
          <UserSearch @select="(user) => users.push(user)"/>
        </div>
        <div>
          <div v-for="user in users" :key="user.UserID">
            <p>{{ user.Username }}</p>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading || !counterName || !selectedIcon">
          <span v-if="!isLoading">Create Counter</span>
          <span v-else class="loading-text">Creating...</span>
        </button>
      </form>
    </div>
  </ModalComponent>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EmojiPicker, { type EmojiExt } from 'vue3-emoji-picker'
import ModalComponent from '../ui/ModalComponent.vue';
import 'vue3-emoji-picker/css';
import type { Counter } from '@/types/Counter';
import { createCounter } from '@/api/counter';
import UserSearch from './UserSearch.vue';
import type { UserSearchResult } from '@/types/User';

const emit = defineEmits<{
  close: [],
  success: [Counter]
}>()

const counterName = ref('');
const selectedIcon = ref('😀');
const showPicker = ref(false);
const isLoading = ref(false);
const users = ref<UserSearchResult[]>([])
const theme = ref<'light' | 'dark' | 'auto'>((document.documentElement.dataset.theme as 'light' | 'dark' | 'auto') || 'dark')

const onEmojiSelect = (emoji: EmojiExt) => {
  console.log(emoji)
  selectedIcon.value = emoji.i
  showPicker.value = false
};

const handleSubmit = () => {
  if (counterName.value && selectedIcon.value) {
    isLoading.value = true;
    createCounter(counterName.value, selectedIcon.value, users.value).then((res) => {
      isLoading.value = false;

      emit('success', {
        ID: res.ID,
        Name: res.Name,
        Icon: res.Icon,
        EntryCount: 0,
      } as Counter);
    })
  }
};
</script>

<style scoped>
form{
  display: flex;
  flex-direction: column;
}
.counter-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background: var(--background-light);
  border-radius: 12px;
}

.form-header {
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--background-mid-light);
  font-size: 20px;
  font-weight: 600;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group-icon {
  flex-shrink: 0;
}

.form-group-name {
  flex: 1;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.form-input {
  padding: 12px;
  font-size: 16px;
  background: var(--background);
  border: 2px solid var(--background-mid-light);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
}

.icon-selector {
  position: relative;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 48px;
  padding: 0;
  background: var(--background);
  border: 2px solid var(--background-mid-light);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.icon-button:hover:focus {
  border-color: var(--primary);
}

.selected-icon {
  font-size: 28px;
}

.emoji-picker {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.submit-button {
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  background: var(--primary-dark);
}

.submit-button:not(:disabled):active {
  transform: scale(0.98);
}

.loading-text {
  display: inline-block;
}
</style>
