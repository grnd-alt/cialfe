<script setup lang="ts">
import jdenticon from 'jdenticon/standalone'
import { onMounted, useTemplateRef } from 'vue'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
onMounted(() => {
  if (canvas.value) {
    jdenticon.update(canvas.value)
  }
})
defineProps<{
  username: string
}>()
</script>
<template>
  <canvas ref="canvas" width="80" height="80" :data-jdenticon-value="username"></canvas>
</template>
