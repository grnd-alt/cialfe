<script setup lang="ts">
import { follow, getPosts, getUser, unfollow } from '@/api/api'
import UserTop from '@/components/users/UserTop.vue'
import { useRoute } from 'vue-router'
import { type PostData, type Comment } from '@/types/Post'
import { ref, watch } from 'vue'

import FeedComponent from '@/components/FeedComponent.vue'
import type { User } from '@/types/User'
import { useSubscriptionStore } from '@/stores/counter'

const route = useRoute()
const pageNumber = ref(0)
const posts = ref<Array<PostData>>([])
const user = ref<User>()
const username = ref<string>(route.params.username as string)
const allLoaded = ref(false)

watch(() => route.params.username, (newUsername) => {
  username.value = newUsername as string
  pageNumber.value = 0
  posts.value = []
  allLoaded.value = false
  expandPosts()
  loadUser()
})

const substore = useSubscriptionStore()

const expandPosts = () => {
    getPosts(username.value, pageNumber.value).then((res) => {
      if (!res.data || res.data.length === 0) {
        allLoaded.value = true
        return
      }
      pageNumber.value++
      posts.value = posts.value.concat(res.data)
    })
}

expandPosts()

const loadUser = () => {
    getUser(username.value).then((res) => {
      user.value = res.data
    })
}
loadUser()

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
    <UserTop :username="user!.username" :followers-count="user!.followers"
       :following-count="user!.followingcount" :isFollowing="user!.isfollowing" @unfollow = "() => unfollow(user!.username).then(loadUser)" @follow="() => follow(user!.username, substore.getSubscription()).then(loadUser)" />
    <FeedComponent :all-loaded="allLoaded" :posts="posts" @end-reached="expandPosts" @comment-created="commentAdded" />
  </div>
</template>

<style scoped></style>
