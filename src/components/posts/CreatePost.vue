<script setup lang="ts">
import { createPost } from '@/api/api'
import { ref } from 'vue'
import { usePostStore } from '../../stores/counter'
import { useTextareaAutosize } from '@vueuse/core'
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { mdiPlus } from '@mdi/js'
import { computed } from 'vue'


const postFile = ref<File | null>(null)
const loading = ref<boolean>(false)
const postStore = usePostStore()

const previewUrl = computed(() => {
  return postFile.value ? URL.createObjectURL(postFile.value) : ''
})

const { textarea, input: postContent } = useTextareaAutosize()

function onSubmit(event: Event) {
  event.preventDefault()
  loading.value = true
  createPost({ content: postContent.value, file: postFile.value! }).then((res) => {
    postStore.addPost(res.data)
    loading.value = false
    postContent.value = ''
    postFile.value = null
  }).catch(() => {
    alert('Error creating post, check your internet connection and try again.')
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
    <form @submit="onSubmit" :class="{ 'create-post-form':true ,'form-disabled': loading }">
      <label class="post-file-label" v-if="!postFile">
        <input type="file" v-on:change="setFile" required :disabled="loading" />
        <SVGIcon type="mdi" :path="mdiPlus" size="18" />
        Take Picture
      </label>
      <div class="submit-area">
        <textarea ref="textarea" type="text" id="post-content" placeholder="Write a post description"
          v-model="postContent" required :disabled="loading">
      </textarea>
        <button type="submit" id="post-submit" :disabled="loading">
          <span>Publish</span>
        </button>
      </div>
    </form>
    <img v-if="postFile" :src="previewUrl" alt="Post Preview" class="post-preview" />
    <span v-if="loading" class="spinner"></span>
  </div>
</template>

<style scoped>
.create-post {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  justify-content: space-between;
  width: max-content;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: auto;
    max-height: 20rem;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
}
.create-post-form {
  width: 100%;
}
.submit-area{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: space-between;
}

.post-file-label {
  display: flex;
  align-items: center;
  padding-inline: 4px;
  width: fit-content;
  font-size: 17px;
  background: var(--primary);
  border: 2px solid var(--primary-dark);

  input {
    overflow: hidden;
    width: 0;
  }

  cursor: pointer;
}

#post-file {
  outline: none;

  background: var(--primary);
  border: 2px solid var(--primary-dark);
}

#post-submit {
  background: var(--primary);
  border: 2px solid var(--primary-dark);
  font-size: 17px;
  outline: none;
  cursor: pointer;
}

.form-disabled {
  opacity: 0.5;
  pointer-events: none;
}

button {
  position: relative;
}


.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 4px solid var(--primary);
  border-left-color: #000;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

#post-content {
  width: 100%;
  max-width: 100%;
  max-height: 10rem;
  min-height: 2rem;
  outline: none;
  background: var(--background-light);
  border: none;
  resize: none;
}

textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
