<script setup lang="ts">
import { getLatest } from '@/api/api'
import { type PostData, type Comment } from '@/types/Post'
import { ref } from 'vue'

import FeedComponent from '@/components/FeedComponent.vue'

const pageNumber = ref(0)
const posts = ref<Array<PostData>>([])
const allLoaded = ref(false)

const expandPosts = () => {
  getLatest(pageNumber.value).then((res) => {
    if (!res.data) {
      allLoaded.value = true
      return
    }
    pageNumber.value++
    posts.value = posts.value.concat(res.data)
    console.log(posts.value)
  })
}

expandPosts()

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
    <FeedComponent
      :all-loaded="allLoaded"
      :posts="posts"
      @end-reached="expandPosts"
      @comment-created="commentAdded"
    />
  </div>
</template>

<style scoped></style>
