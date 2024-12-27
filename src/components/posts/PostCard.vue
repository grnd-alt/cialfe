<script lang="ts" setup>
import {type Post } from '../../types/Post'
import PostHeader from './PostHeader.vue'
import { defineProps } from 'vue';
const { post } = defineProps({
  post: {
    type: Object as () => Post,
    required: true,
  },
})

</script>
<template>
  <div class="post-card">
    <PostHeader class="header" :username="post.Username" :content="post.Content" :created-at="post.CreatedAt"/>
    <div class="post-card__image">
      <img :src="post.Filepath" alt="post image not loaded"/>
    </div>
  </div>
</template>

<style scoped>
.header{
  padding-bottom: .5rem;
  padding-inline: 8px;
}
.post-card{
  background-color: #f9f9f9;
  padding-top: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height:100%;
  overflow: hidden;
}
.post-card__image{
  display: flex;
  flex-direction: column;
  max-height: 400px;
  max-width: 100%;
}
img{
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  display: block;
  object-fit: cover;
  max-height: inherit;
  max-width: inherit;
  width: auto;
  height: auto;
}
</style>
