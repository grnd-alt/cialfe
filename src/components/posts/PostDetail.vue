<script setup lang="ts">
import { ref } from 'vue';
import ModalComponent from '../ui/ModalComponent.vue';
import { type Post, type Comment } from '@/types/Post';
import CommentsList from '../ui/CommentsList.vue';
import { getCommentsByPost } from '@/api/api';
import CommentInput from './CommentInput.vue';

const emit = defineEmits(['close', 'comment-created']);
const { post } = defineProps<{
  post: Post
}>()

const imageLoaded = ref<boolean>(false)

const comments = ref<Comment[]>([]);
const page = ref<number>(0);
const endReached = ref<boolean>(false);

const getNextPage = async () => {
  if (endReached.value) return; // Prevent further requests if end is reached
  try {
    getCommentsByPost(post.ID, page.value).then((response) => {
      if (response.data.comments && response.data.comments.length > 0) {
        comments.value.push(...response.data.comments);
      } else {
        endReached.value = true;
      }
    })
    page.value++
  } catch (error) {
    endReached.value = true;
    console.error('Error fetching comments:', error);
  }
}

const commentCreated = (comment: Comment) => {
  comments.value.unshift(comment);
  emit('comment-created', comment);
}

</script>
<template>
  <ModalComponent @close="$emit('close')">
    <div class="post-detail">
      <div class="post-card__image">
        <div v-if="!imageLoaded" class="spinner"></div>
        <img :src="post.Filepath" alt="post image not loaded" @load="imageLoaded = true" />
      </div>
      <div class="comment-box">
      </div>
      <div class="all-comments">
        <CommentsList :comments @end-reached="getNextPage" />
      </div>
    </div>
    <div class="comment-input">
      <CommentInput :post_id="post.ID" @comment-created="commentCreated" />
    </div>
  </ModalComponent>
</template>
<style scoped>

.post-detail {
  text-align: center;
  /* height: 100%; */
  max-height: calc(60vh - 25px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
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

.post-card__image {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  max-width: 100%;
}

img {
  border-radius: 15px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  display: block;
  object-fit: cover;
  max-height: inherit;
  max-width: inherit;
  width: auto;
  height: auto;
}

.all-comments {
  padding: 10px;
  /* margin-bottom: 15px; */
}
</style>
