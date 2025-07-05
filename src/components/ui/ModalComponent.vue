<script lang="ts" setup>
import { mdiClose } from '@mdi/js';
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { onMounted, onUnmounted } from 'vue';
import { createFocusTrap, type FocusTrap } from 'focus-trap';
import { templateRef } from '@vueuse/core';

const emit = defineEmits(['close'])

const modal = templateRef('modal')

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    // Emit close event when clicking on the backdrop
    emit('close')
  }
}

let trap: FocusTrap | null = null;
onMounted(() => {
  document.body.style.overflow = 'hidden'
  if (!trap) {
    trap = createFocusTrap(modal.value, {
      initialFocus: false,
      fallbackFocus: modal.value
    })
  }
  trap.activate()

})

onUnmounted(() => {
  document.body.style.overflow = 'scroll'
  if (trap) {
    trap.deactivate()
  }
})

</script>
<template>
  <div class="modal" @click="handleBackdropClick" ref="modal">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">
        <SVGIcon type="mdi" :path="mdiClose" :size="25" />
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-light);
  padding-inline: 10px;
  padding-top: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  width: 90vw;
  max-height: 80vh;
  height: fit-content;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
