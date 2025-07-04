<script lang="ts" setup>
import { ref } from 'vue'
const { username, content, createdAt, postId, showDots } = defineProps({
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  showDots: { type: Boolean, default: true }
})
import { useTimeAgo } from '@vueuse/core'
import DotsMenuButton from '../ui/DotsMenuButton.vue'
import PostMenu from './PostMenu.vue'

const timeago = useTimeAgo(createdAt)
const maxContentLength = 40
const contentToLong = content.length > maxContentLength
const showFullContent = ref(!contentToLong)

const emit = defineEmits(['post-deleted'])

const toggleContent = () => {
  showFullContent.value = !showFullContent.value
}

const userLink = `/user/${username}`

const showMenu = ref(false)
const hideMenu = () => {
  emit('post-deleted', postId)
}
</script>
<template>
  <div class="post-header">
    <div class="header-info">
      <div class="creator-info">
      <RouterLink class="username" :to="userLink">
        {{ username }}
       </RouterLink>

        <span class="time">{{ timeago }}</span>
      </div>
      <DotsMenuButton :hide-menu="showMenu" v-if="showDots">
        <PostMenu :post-id="postId" @post-deleted="hideMenu"/>
      </DotsMenuButton>
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.username {
  text-decoration: none;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  /* color: #333; */
}

.time {
  font-size: 0.9rem;
  color: var(--text-secondary);
  /* color: #888; */
}

.content {
  font-size: 1rem;
  /* color: #555; */
  line-height: 1.5;
}
</style>
