<script lang="ts" setup>
import type { Post, PostData } from '@/types/Post';
import { defineProps, ref } from 'vue';
import { defineEmits } from 'vue';
import { vElementVisibility } from '@vueuse/components'
import PostDetail from './posts/PostDetail.vue';

const emit = defineEmits(['end-reached']);

const detailPost = ref<Post | null>();

const { posts, allLoaded } = defineProps<{
  posts: Array<PostData>;
  allLoaded: boolean
}>();

const onElementVisibility = (state: boolean) => {
  if (state && !allLoaded) {
    emit('end-reached');
  }
};
const openDetailView = (post: PostData) => {
  detailPost.value = post.Post
}
</script>

<template>
  <div class="grid-feed">
    <div class="post" v-for="(post, index) in posts" :key="post.Post.ID" @click="() => openDetailView(post)">
      <img :src="post.Post.Filepath" alt="post image not loaded" class="post-image" />
      <div v-if="index >= posts.length - 2">
        <div v-element-visibility="onElementVisibility"></div>
      </div>
      <div v-if="index === posts.length - 1">
        <div v-if="!allLoaded">LOADING</div>
      </div>
    </div>

    <PostDetail v-if="detailPost" @close="detailPost = null" :post="detailPost" @comment-created="() => {}"/>
  </div>
</template>

<style scoped>
.grid-feed {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.post {
  border: 3px solid var(--background);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.post-image {
  width: 100%;
  height: 100%;
  display: block;
  aspect-ratio: 1 / 1; /* Ensures square aspect ratio */
  object-fit: cover;
}

</style>
