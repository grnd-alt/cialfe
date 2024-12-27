<script setup lang="ts">
import { getMe, createPost, getPosts } from '@/api/api'
import { type Post } from '@/types/Post'
import PostCard from '@/components/posts/PostCard.vue'
import { ref, onUnmounted } from 'vue'

const me = ref()
const countdown = ref<string>('')

const postContent = ref<string>('')
const postFile = ref<File | null>(null)
const posts = ref<Array<Post>>([])

function loadPosts() {
  getPosts().then((res) => (posts.value = res.data))
}
loadPosts()

function onSubmit(event: Event) {
  event.preventDefault()
  createPost({ content: postContent.value, file: postFile.value! }).then((res) => {
    if (!posts.value) {
      posts.value = []
    }
    posts.value.unshift(res.data)
  })
}

getMe().then((res) => {
  me.value = res.data
  startCountdown()
})

let intervalId: number | null = null

function startCountdown() {
  if (me.value && me.value.exp) {
    updateCountdown()
    intervalId = setInterval(updateCountdown, 1000)
  }
}

function updateCountdown() {
  if (me.value && me.value.exp) {
    const now = new Date().getTime()
    const expTime = me.value.exp * 1000
    const timeLeft = expTime - now

    if (timeLeft <= 0) {
      countdown.value = 'Token has expired'
      clearInterval(intervalId!)
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      countdown.value = `${hours}h ${minutes}m ${seconds}s`
    }
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const setFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    postFile.value = file
  }
}
</script>

<template>
  <main>
    <div>
      <h1>Me</h1>
      <p v-if="me && me.preferred_username">Hello, {{ me.preferred_username }}!</p>
      <p v-if="countdown">{{ countdown }}</p>
      <form @submit="onSubmit">
        <label for="post-content">Content</label>
        <input type="text" id="post-content" v-model="postContent" required />
        <label for="post-file">Content</label>
        <input type="file" id="post-file" v-on:change="setFile" required />
        <input type="submit" value="submit" />
      </form>
      <div class="posts">
        <div class="post" v-for="post in posts" :key="post.ID">
          <PostCard :post="post" />
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  .post{
    display: flex;
    flex-direction: column;
    margin: 2rem;
    width: min(400px, 100%);
  }
}
</style>
