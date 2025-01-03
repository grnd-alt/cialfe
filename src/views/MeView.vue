<script setup lang="ts">
import { getMe, createPost, getPosts } from '@/api/api'
import { type PostData, type Comment } from '@/types/Post'
import FeedComponent from '@/components/FeedComponent.vue'
import { ref, onUnmounted } from 'vue'

const me = ref()
const countdown = ref<string>('')

const postContent = ref<string>('')
const postFile = ref<File | null>(null)
const posts = ref<Array<PostData>>([])
const page = ref<number>(0)
const endReached = ref<boolean>(false)

function loadPosts() {
  getPosts(me.value.preferred_username, 0).then((res) => (posts.value = res.data))
}

function expandPosts() {
  page.value++
  getPosts(me.value.preferred_username, page.value).then((res) => {
    if (!res.data) {
      endReached.value = true
      return
    }
    posts.value = posts.value.concat(res.data)
  })
}

function onSubmit(event: Event) {
  event.preventDefault()
  createPost({ content: postContent.value, file: postFile.value! }).then((res) => {
    if (!posts.value) {
      posts.value = []
    }
    posts.value.unshift({ Post: res.data, Comments: [] })
  })
}

getMe().then((res) => {
  me.value = res.data
  startCountdown()
  loadPosts()
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

const commentAdded = (comment: Comment) => {
  const postIndex = posts.value.findIndex((post) => post.Post.ID === comment.PostID)
  if (postIndex !== -1) {
    if (!posts.value[postIndex].Comments) {
      posts.value[postIndex].Comments = []
    }
    posts.value[postIndex].Comments.unshift(comment)
  }
}

const scrolledDown = () => {
  expandPosts()
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
      <FeedComponent
        :all-loaded="endReached"
        :posts="posts"
        @end-reached="scrolledDown"
        @comment-created="commentAdded"
      />
    </div>
  </main>
</template>
<style scoped>
</style>
