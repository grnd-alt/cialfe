<script setup lang="ts">
import { createPost } from '@/api/api'
import { ref } from 'vue'
import { usePostStore } from '../../stores/counter'
const postContent = ref<string>('')
const postFile = ref<File | null>(null)
const loading = ref<boolean>(false)
const postStore = usePostStore()

function onSubmit(event: Event) {
  event.preventDefault()
  loading.value = true
  createPost({ content: postContent.value, file: postFile.value! }).then((res) => {
    postStore.addPost(res.data)
    loading.value = false
  })
}

const setFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    postFile.value = file
  }
}
</script>

<template>
  <div class="create-post">
    <form @submit="onSubmit" :class="{ 'form-disabled': loading }">
      <input type="text" id="post-content" placeholder="title" v-model="postContent" required :disabled="loading" />
      <input type="file" id="post-file" v-on:change="setFile" required :disabled="loading" />
      <button type="submit" :disabled="loading">
        <span>Submit</span>
      </button>
    </form>
    <span v-if="loading" class="spinner"></span>
  </div>
</template>

<style scoped>
.form-disabled {
  opacity: 0.5;
  pointer-events: none;
}

button {
  position: relative;
}

.create-post {
  position: relative;
  width: max-content;
  max-width: 100%;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
