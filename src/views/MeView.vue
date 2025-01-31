<script setup lang="ts">
import { getPosts } from '@/api/api'
import { type PostData, type Comment } from '@/types/Post'
import FeedComponent from '@/components/FeedComponent.vue'
import CreatePost from '@/components/posts/CreatePost.vue'
import { useMeStore, usePostStore } from '../stores/counter'
import { ref, onUnmounted } from 'vue'

const postStore = usePostStore()
const meStore = useMeStore()

const me = ref()
const countdown = ref<string>('')

const posts = ref<Array<PostData>>([])
const page = ref<number>(0)
const endReached = ref<boolean>(false)

postStore.getMePosts().then((res) => (posts.value = res))

meStore.getMe().then((res) => {
  me.value = res
  startCountdown()
})

function expandPosts() {
  page.value++
  getPosts(me.value.preferred_username, page.value).then((res) => {
    if (!res.data || res.data.length === 0) {
      endReached.value = true
      return
    }
    posts.value = posts.value.concat(res.data)
  })
}

function startCountdown() {
  if (me.value && me.value.exp) {
    updateCountdown()
    intervalId = setInterval(updateCountdown, 1000)
  }
}

let intervalId: number | null = null

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
const postDeleted = (id: string) => {
  postStore.removePost(id)
  postStore.getMePosts().then((res) => (posts.value = res))
}
</script>

<template>
  <main>
    <div>
      <h1>Me</h1>
      <p v-if="me && me.preferred_username">Hello, {{ me.preferred_username }}!</p>
      <CreatePost />
      <FeedComponent
        :all-loaded="endReached"
        :posts="posts"
        @end-reached="scrolledDown"
        @comment-created="commentAdded"
        @post-deleted="postDeleted"
      />
    </div>
  </main>
</template>
<style scoped></style>
