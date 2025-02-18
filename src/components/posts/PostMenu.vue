<script setup lang="ts">

const emit = defineEmits(['post-deleted'])
import { deletePost } from '../../api/api'

const {postId} = defineProps({
  postId: {
    type: String,
    required: true
  }
})
const deletePostFN = () => {
  deletePost(postId).then(() => {
    emit('post-deleted', postId)
  })
}
</script>
<template>
  <div class="post-menu">
    <div class="menu">
      <button @click="deletePostFN">Delete post</button>
    </div>
  </div>
</template>
<style scoped>
button{
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  color: white;
  border-top: 1px solid white;
  width: 100%;
  text-align: left;
  padding-inline: 10px;
}
button :hover,:focus{
  background: grey;
}
</style>
