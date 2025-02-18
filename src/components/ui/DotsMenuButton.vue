<script lang="ts" setup>
import { mdiDotsVertical } from '@mdi/js'
// @ts-expect-error lib has no types
import SVGIcon from '@jamescoyle/vue-icon'
import { ref, watch } from 'vue'

const { hideMenu } = defineProps({
  hideMenu: {
    type: Boolean,
    required: false,
    default: false
  }
})

watch(() => hideMenu, (value) => {
  showMenu.value = !value
})

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

</script>

<template>
<div class="dots-menu-button" >
  <SVGIcon type="mdi" :path="mdiDotsVertical" :size="32" @click="toggleMenu"/>
  <div class="dots-menu" v-if="showMenu">
    <slot ></slot>
  </div>
</div>
</template>
<style scoped>
.dots-menu-button{
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}

.dots-menu{
  background: black;
  width: 150px;
  position: absolute;
  top: 100%;
  right: 0%;
}
</style>
