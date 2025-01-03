<script setup lang="ts">
import { type PostData, type Comment } from '@/types/Post'
import PostCard from '@/components/posts/PostCard.vue'
import { vElementVisibility } from '@vueuse/components'
const emit = defineEmits(['comment-created', 'end-reached'])
const { posts, allLoaded } = defineProps({
  posts: {
    type: Array as () => Array<PostData>,
    required: true,
  },
  allLoaded: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const addComment = (comment: Comment) => {
  emit('comment-created', comment)
}
const onElementVisibility = (state: boolean) => {
  if (state && !allLoaded) {
    emit('end-reached')
  }
}
</script>

<template>
  <div class="feed">
    <div class="post" v-for="(post, index) in posts" :key="post.Post.ID">
      <PostCard :post="post.Post" :comments="post.Comments" @comment-created="addComment" />
      <div v-if="index >= posts.length - 2">
        <div v-element-visibility="onElementVisibility"></div>
      </div>
      <div v-if="index === posts.length - 1">
        <div v-if="!allLoaded">LOADING</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
}
.post {
  display: flex;
  flex-direction: column;
  margin: 2rem;
  width: min(400px, 100%);
}
</style>
