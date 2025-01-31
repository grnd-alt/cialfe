<script lang="ts" setup>
import { type Post, type Comment } from '../../types/Post'
import PostHeader from './PostHeader.vue'
import { createComment } from '../../api/api'
import { defineProps } from 'vue'
import { ref } from 'vue';

const emit = defineEmits(['comment-created', 'post-deleted'])
const { post,comments } = defineProps({
  post: {
    type: Object as () => Post,
    required: true,
  },
  comments:{
    type: Array as () => Array<Comment>,
    required: false,
    default: () => []
  }
})

const commentText = ref<string>('')

const addCommentHandle = (event: Event) => {
  event.preventDefault()
  createComment(commentText.value, post.ID).then(result => {
    emit('comment-created', result.data)
    commentText.value = ''
  })
}
const postDeleted = () => {
  emit("post-deleted")
}
</script>
<template>
  <div class="post-card">
    <PostHeader
      class="header"
      :username="post.Username"
      :content="post.Content"
      :created-at="post.CreatedAt"
      :post-id="post.ID"
      @post-deleted="postDeleted"
    />
    <div class="post-card__image">
      <img :src="post.Filepath" alt="post image not loaded" />
    </div>
    <form class="comment-form" v-on:submit="addCommentHandle">
      <input type="text" v-model="commentText" placeholder="Write a comment..." class="comment-input" />
      <button type="submit" class="comment-submit">send</button>
    </form>
    <div class="comments">
      <div class="comment" v-for="comment in comments" :key="comment.ID">
        <span>{{ comment.Content }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding-bottom: 0.5rem;
  padding-inline: 8px;
}

.comment-form{
  display: flex;
  justify-content: space-evenly;
  padding-top: 8px;
  input{
    flex-grow: 1;
  }
}
.comments, .comment-form{
  width: 100%;
  padding-inline: 8px;
}
.post-card {
  background-color: #f9f9f9;
  padding-top: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
}
.post-card__image {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  max-width: 100%;
}
img {
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  display: block;
  object-fit: cover;
  max-height: inherit;
  max-width: inherit;
  width: auto;
  height: auto;
}
</style>
