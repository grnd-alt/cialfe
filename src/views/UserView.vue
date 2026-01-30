<script setup lang="ts">
import { follow, getPosts, getUser, unfollow } from '@/api/api'
import UserTop from '@/components/users/UserTop.vue'
import CounterList from '@/components/users/CounterList.vue'
import { useRoute } from 'vue-router'
import { type PostData, type Comment } from '@/types/Post'
import { computed, ref, watch } from 'vue'

import type { User } from '@/types/User'
import { useMeStore, useSubscriptionStore } from '@/stores/counter'
import GridFeed from '@/components/GridFeed.vue'

const route = useRoute()
const pageNumber = ref(0)
const posts = ref<Array<PostData>>([])
const user = ref<User>()
const username = ref<string>(route.params.username as string)
const allLoaded = ref(false)
const meStore = useMeStore()
const me = ref()
const isMe = computed(() => {
  return me.value.preferred_username === username.value
})

meStore.getMe().then((res) =>
  me.value = res
)

const expandingPosts = ref(false)

watch(me, () => {
  if (!route.params.username) {
    username.value = me.value.preferred_username
  }
  expandPosts()
  loadUser()
})

watch(() => route.params.username, (newUsername) => {
  user.value = undefined
  username.value = newUsername as string || me.value.preferred_username
  pageNumber.value = 0
  posts.value = []
  allLoaded.value = false
  expandPosts()
  loadUser()
})

const substore = useSubscriptionStore()

const expandPosts = () => {
  if (expandingPosts.value === true) {
    return
  }
  expandingPosts.value = true
  getPosts(username.value, pageNumber.value).then((res) => {
    if (!res.data || res.data.length === 0) {
      allLoaded.value = true
      return
    }
    pageNumber.value++
    posts.value = posts.value.concat(res.data)
  }).finally(() => {
    expandingPosts.value = false
  })
}


const loadUser = () => {
  getUser(username.value).then((res) => {
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
  <div v-if="user">
  <!-- <div v-if="isMe" class="notification-testing">
    <NotificationTester />
  </div> -->
    <UserTop :isMe :username="user!.username" :followers-count="user!.followers" :following-count="user!.followingcount"
      :isFollowing="user!.isfollowing" @unfollow="() => unfollow(user!.username).then(loadUser)"
      @follow="() => follow(user!.username, substore.getSubscription()).then(loadUser)" />
    <CounterList :user-i-d="username" :is-me="isMe"/>
    <GridFeed :all-loaded="allLoaded" :posts="posts" @end-reached="expandPosts" @comment-created="commentAdded" />
  </div>
</template>

<style scoped></style>
