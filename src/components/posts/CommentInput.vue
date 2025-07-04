<script setup lang="ts">
import { createComment } from '@/api/api';
import { ref  } from 'vue';


const emit = defineEmits(['comment-created']);

const { post_id } = defineProps({
  post_id: {
    type: String,
    required: true,
  },
});

const commentText = ref<string>('');
const addCommentHandle = (event: Event) => {
  event.preventDefault()
  createComment(commentText.value, post_id).then(result => {
    emit('comment-created', result.data)
    commentText.value = ''
  })
}
</script>

<template>
  <form class="comment-form" v-on:submit="addCommentHandle">
      <input type="text" v-model="commentText" placeholder="Write a comment..." class="comment-input" />
      <button :disabled="commentText === ''" type="submit" class="comment-submit">send</button>
  </form>
</template>

<style scoped>

.comment-form {
  display: flex;
  justify-content: space-evenly;
  padding-top: 8px;

  input {
    flex-grow: 1;
  }
}
</style>
