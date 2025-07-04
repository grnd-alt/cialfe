<script setup lang="ts">
import { defineProps } from 'vue';
import { type Comment } from '@/types/Post';
import CommentComponent from '../posts/CommentComponent.vue';
import { vElementVisibility } from '@vueuse/components'
const { comments } = defineProps<{
  comments: Comment[]
}>();

const emit = defineEmits(['end-reached'])

const elementVisible = () => {
  emit('end-reached');
}
</script>

<template>
  <div class="comments-list">
    <div v-for="comment in comments" :key="comment.ID" class="comment-item">
      <CommentComponent :comment="comment" />
    </div>
    <div v-element-visibility="elementVisible"></div>
  </div>
</template>

<style scoped>
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
