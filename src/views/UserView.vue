<script setup lang="ts">
import { getPosts, getUser,follow,unfollow } from '@/api/api'
import { useRoute } from 'vue-router'
import { type PostData, type Comment } from '@/types/Post'
import { ref } from 'vue'

import FeedComponent from '@/components/FeedComponent.vue'
import type { User } from '@/types/User'
import { useSubscriptionStore } from '@/stores/counter'

const route = useRoute()
const pageNumber = ref(0)
const posts = ref<Array<PostData>>([])
const user = ref<User>()
const allLoaded = ref(false)

const subStore = useSubscriptionStore()

const expandPosts = () => {
  if (typeof route.params.username === 'string') {
    getPosts(route.params.username, pageNumber.value).then((res) => {
      if (!res.data || res.data.length === 0) {
        allLoaded.value = true
        return
      }
      pageNumber.value++
      posts.value = posts.value.concat(res.data)
    })
  }
}

expandPosts()

if (typeof route.params.username === 'string') {
  getUser(route.params.username).then((res) => {
    user.value = res.data
  })
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
</script>
<template>
  <div>
    {{ $route.params.username }}
    Following: {{ user?.followingcount }}
    Followers: {{ user?.followers || 0 }}
    <button v-if="!user?.isfollowing" @click="() => follow(user!.username,subStore.getSubscription())">
      Follow
    </button>
    <button v-else @click="() => unfollow(user!.username)">
      Unfollow
    </button>
    <FeedComponent :all-loaded="allLoaded" :posts="posts" @end-reached="expandPosts" @comment-created="commentAdded" />
  </div>
</template>

<style scoped></style>
