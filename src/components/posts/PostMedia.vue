<script setup lang="ts">
import { getMedia } from '@/api/api';
import { onMounted, ref } from 'vue';

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

onMounted(() => {
  getMedia(url).then((response) => {
    if (response.headers['content-type'].startsWith('video/')) {
      isVideo.value = true;
    } else {
      isVideo.value = false;
    }
    blob.value = new Blob([response.data], { type: response.headers['content-type'] });
    blobUrl.value = URL.createObjectURL(blob.value);
  }).catch(error => {
    console.error('Error fetching image:', error);
  });
})

</script>
<template>
  <img v-if="!isVideo && blobUrl" :src="blobUrl" alt="Post media" />
  <video v-else-if="blobUrl" :controls :autoplay loop muted class="post-media">
    <source :src="blobUrl">
    Your browser does not support videos.
  </video>
</template>
