<script setup lang="ts">
import { RouterLink } from 'vue-router'
const { comment } = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const userLink = `/user/${comment.UserName}`
</script>

<template>
  <div class="comment">
    <RouterLink class="username" :to="userLink">
      {{ comment.UserName }}:
    </RouterLink>
    <div class="comment-content">
      {{ comment.Content }}
    </div>
  </div>
</template>
<style>
.username {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-weight: bold;
  padding-right: 5px;
}
.comment {
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  width: 100%;
}
.comment-content {
  display: inline;
}
</style>
