<script lang="ts" setup>
import { type Post, type Comment } from '../../types/Post'
import PostHeader from './PostHeader.vue'
import { createComment } from '../../api/api'
import CommentComponent from './CommentComponent.vue'
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
const imageLoaded = ref<boolean>(false)

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
      <div v-if="!imageLoaded" class="spinner"></div>
      <img :src="post.Filepath" alt="post image not loaded" @load="imageLoaded = true" />
    </div>
    <form class="comment-form" v-on:submit="addCommentHandle">
      <input type="text" v-model="commentText" placeholder="Write a comment..." class="comment-input" />
      <button :disabled="commentText === ''" type="submit" class="comment-submit">send</button>
    </form>
    <div class="comments">
      <div v-for="comment in comments" :key="comment.ID">
        <CommentComponent :comment="comment" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-inline: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
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
.comments{
  margin-top: 4px;
}
.comment-form{
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
