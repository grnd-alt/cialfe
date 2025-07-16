<script setup lang="ts">
import { notifyMe } from '@/api/api';
import { ref } from 'vue'
import Button from '@/components/ui/ButtonComponent.vue';
const permission = ref(window.Notification.permission)

const notify = () => {
  notifyMe().then((res) => {
    if (res.status !== 200) {
      alert(`something failed please share this with the developers:${res.data}`)
    }
  })
}
</script>

<template>
  <div v-if="permission === 'granted'" class="notification-tester">
    <Button @click="notify">
      Send a notification
    </Button>
  </div>
</template>
<style scoped>
.notification-tester {
  width: 100%;
  text-align: center;
}
</style>
