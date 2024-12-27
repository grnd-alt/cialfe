<script lang="ts" setup>
import { ref } from 'vue'
const { username, content, createdAt } = defineProps<{
  username: string
  content: string
  createdAt: string
}>()
import { useTimeAgo } from '@vueuse/core'
const timeago = useTimeAgo(createdAt)
const maxContentLength = 40
const contentToLong = content.length > maxContentLength
const showFullContent = ref(!contentToLong)

const toggleContent = () => {
  showFullContent.value = !showFullContent.value
}
</script>
<template>
  <div class="post-header">
    <div class="header-info">
      <span class="username">{{ username }}</span>
      <span class="time">{{ timeago }}</span>
    </div>
    <span class="content" :class="{ truncated: !showFullContent }">
      {{ contentToLong && !showFullContent ? content.slice(0, maxContentLength) + '...' : content }}
    </span>
    <span>
      <button v-if="!showFullContent && contentToLong" @click="toggleContent">more</button>
      <button v-else-if="contentToLong" @click="toggleContent">less</button>
    </span>
  </div>
</template>

<style scoped>

.header-info {
  text-align: bottom;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.username {
  margin-right: .5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.time {
  font-size: 0.9rem;
  color: #888;
}

.content {
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
}
</style>
