<script setup lang="ts">
import { getMedia } from '@/api/api';
import { onMounted, ref, watch } from 'vue';

const { url, autoplay, controls } = defineProps({
  url: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: true
  }
})

const blob = ref<Blob | null>(null);
const isVideo = ref<boolean>(false);
const blobUrl = ref<string | null>(null);
const isLoading = ref<boolean>(true);
watch(isLoading, (newValue) => {
  console.log("LOADING: ")
  console.log(newValue)
})

onMounted(() => {
  getMedia(url).then((response) => {
    if (response.headers['content-type'].startsWith('video/')) {
      isVideo.value = true;
    } else {
      isVideo.value = false;
    }
    blob.value = new Blob([response.data], { type: response.headers['content-type'] });
    blobUrl.value = URL.createObjectURL(blob.value);
    isLoading.value = false;
  }).catch(error => {
    console.error('Error fetching image:', error);
    isLoading.value = false;
  });
})

</script>
<template>
  <div class="skeleton-media" v-if="isLoading"></div>
  <img v-else-if="!isVideo && blobUrl" :src="blobUrl" alt="Post media" />
  <video v-else-if="blobUrl" :controls :autoplay loop muted class="post-media">
    <source :src="blobUrl">
    Your browser does not support videos.
  </video>
</template>

<style scoped>
.skeleton-media {
  width: 100%;
  min-height: 300px;
  aspect-ratio: 9 / 16;
  background: linear-gradient(90deg, var(--background-light, #e0e0e0) 25%, var(--background-lighter, #f0f0f0) 50%, var(--background-light, #e0e0e0) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
