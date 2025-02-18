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
      {{ comment.UserName }}
    </RouterLink>
    <div>
      {{ comment.Content }}
    </div>
  </div>
</template>
<style>
.username {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
}
.comment {
  border-top: 1px solid black;
  border-inline: 1px solid black;
  border-radius: 8px;
  padding: 4px;
}
</style>
