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
        <div class="user-name">
          {{ username }}
        </div>
    <div class="user-top-header">
      <div class="user-avatar">
        <AvatarImage :username="username" />
      </div>
      <div class="user-info">
        <div class="user-follow-data">
            <div class="user-followers-count">
                  <span class="count">{{ followersCount }}</span><br>
                  <span class="label">followers</span>
            </div>
            <div class="user-following-count">
                  <span class="count">{{ followingCount }}</span><br>
                  <span class="label">following</span>
            </div>
        </div>
      </div>
    </div>
    <div v-if="!isMe" class="user-follow-actions">
      <button class="follow-btn" v-if="!isFollowing" @click="$emit('follow')">Follow</button>
      <button class="unfollow-btn" v-else @click="$emit('unfollow')">Unfollow</button>
    </div>
  </div>
</template>

<style scoped>
.user-top {
  background: linear-gradient(180deg, var(--background-mid-light), var(--background));
  padding: 12px 14px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  margin: 0 auto;
}
.user-name {
  font-size: 1.6rem;
  font-weight: 700;
  padding: 6px 8px;
  width: 100%;
  text-align: center;
}
.user-top-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.user-avatar {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 96px;

  canvas {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    background-color: white;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  .user-follow-data{
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .user-follow-data > .user-followers-count,
  .user-follow-data > .user-following-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 64px;
  }
  .user-following-count {
    padding-left: 0;
  }
  .count {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1;
  }
  .label {
    font-weight: 500;
  }
  .user-follow-buttons button{
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }
}

.user-follow-actions button{
  min-width: 140px;
  max-width: 60%;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}
.user-follow-actions .follow-btn{
  background: var(--primary);
  color: var(--background-light);
  border: 1px solid transparent;
}
.user-follow-actions .follow-btn:hover:focus{
  background: var(--primary-dark, var(--primary));
}
.user-follow-actions .unfollow-btn{
  background: var(--background-light);
  color: var(--text);
  border: 1px solid var(--background-light);
}
.user-follow-actions .unfollow-btn:hover:focus{
  background: var(--background-mid-light);
  color: var(--text);
}
</style>
