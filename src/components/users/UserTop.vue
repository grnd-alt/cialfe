<script setup lang="ts">
import AvatarImage from '../ui/AvatarImage.vue';

defineEmits<{
  follow: () => void
  unfollow: () => void
}>()

defineProps<{
  username: string
  followingCount: number
  followersCount: number
  isFollowing: boolean
  isMe: boolean
}>()

</script>
<template>
  <div class="user-top">
    <div class="user-top-header">
      <div class="user-avatar">
        <AvatarImage :username="username" />
      </div>
      <div class="user-info">
        <div class="user-name">
          {{ username }}
        </div>
        <div v-if="!isMe" class="user-follow-buttons">
          <button v-if="!isFollowing" @click="$emit('follow')">Follow</button>
          <button v-else @click="$emit('unfollow')">Unfollow</button>
        </div>
        <div class="user-follow-data">
            <div class="user-followers-count">
              {{ followersCount }} Follower{{ followersCount > 1 ? 's' : '' }}
            </div>
            <div class="user-following-count">
              {{ followingCount }} Following
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-top-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  height: min-content;
}

.user-avatar {
  flex-basis: 30%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    border-radius: 50%;
    overflow: hidden;
    background-color: white;
    aspect-ratio: 1 / 1;
  }
}

.user-info {
  flex-basis: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  .user-follow-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
  .user-follow-data{
    width: 100%;
    display: flex;
    justify-content: baseline;
    .user-following-count {
      padding-left: 10px;
    }
  }
}
</style>
