<script lang="ts" setup>
import { type Post, type Comment } from '../../types/Post'
import PostHeader from './PostHeader.vue'
import CommentComponent from './CommentComponent.vue'
import { ref } from 'vue';
import PostDetail from './PostDetail.vue';
import CommentInput from './CommentInput.vue';
import PostMedia from './PostMedia.vue';



const emit = defineEmits(['comment-created', 'post-deleted'])
const { post, comments } = defineProps({
  post: {
    type: Object as () => Post,
    required: true,
  },
  comments: {
    type: Array as () => Array<Comment>,
    required: false,
    default: () => []
  }
})

const showDetail = ref<boolean>(false)

const postDeleted = () => {
  emit("post-deleted")
}

const showDetails = () => {
  showDetail.value = true
}
const commentCreated = (comment: Comment) => {
  emit('comment-created', comment)
}

</script>
<template>
  <div>
    <div class="post-card">
      <PostHeader class="header" :username="post.Username" :content="post.Content" :created-at="post.CreatedAt"
        :post-id="post.ID" @post-deleted="postDeleted" />
      <div class="post-card__image">
        <PostMedia :url="post.Filepath" />
      </div>
      <CommentInput :post_id="post.ID" @comment-created="commentCreated" />
      <div class="comments">
        <div v-for="comment in (comments ? comments.slice(0,2) : [])" :key="comment.ID">
          <CommentComponent :comment="comment" />
        </div>
      </div>
      <div class="comment-more" v-if="comments?.length > 2" @click="showDetails">
        <span>more...</span>
      </div>
    </div>
    <PostDetail v-if="showDetail" @close="showDetail = false" :post @comment-created="commentCreated" />
  </div>
</template>

<style scoped>
.comment-more {
  padding: 4px;
  span {
    cursor: pointer;
    color: var(--text-secondary);

  }
}

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


.comments {
  margin-top: 4px;
}

.comment-form {
  width: 100%;
  padding-inline: 8px;
}

.post-card {
  cursor: pointer;
  background-color: var(--background-light);
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
