<script setup lang="ts">
import { createComment } from '@/api/api';
// @ts-expect-error lib has no types
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiSend } from '@mdi/js';
import { useTextareaAutosize } from '@vueuse/core';


const emit = defineEmits(['comment-created']);

const { textarea, input: commentText} = useTextareaAutosize()

const { post_id } = defineProps({
  post_id: {
    type: String,
    required: true,
  },
});

const addCommentHandle = (event: Event) => {
  event.preventDefault()
  createComment(commentText.value, post_id).then(result => {
    emit('comment-created', result.data)
    commentText.value = ''
  })
}
</script>

<template>
  <form class="comment-form" v-on:submit="addCommentHandle">
    <div class="input-wrap">
      <textarea ref="textarea" type="text" v-model="commentText" placeholder="Write a comment..." class="comment-input"> </textarea>
      <button v-if="commentText !== ''" type="submit" class="comment-submit">
        <svg-icon type="mdi" :path="mdiSend" size="22" /> </button>
    </div>
  </form>
</template>

<style scoped>
.comment-submit {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

.comment-form {
  display: flex;
  justify-content: space-evenly;
  background-color: var(--background-light);
  padding-top: 8px;
  color: var(--text);

  textarea {
    border: none;
    flex-grow: 1;
    color: var(--text);
    flex-grow: 1;
    background-color: var(--background-light);
    width: 100%;
    min-height: 1.6rem;
    max-height: calc(1.6rem * 8);
  }

  textarea:focus {
    outline: none;
    /* border-bottom: 1px solid var(--primary); */
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
  }

  .input-wrap::after {
    content: '';
    background-color: var(--primary);
    position: absolute;
    width: 0;
    height: 2px;
    left: 50%;
    bottom: 0;
    background-color: var(--primary);
    transition: all ease-out .3s;
  }

  .input-wrap:focus-within::after {
    width: 100%;
    left: 0;
    transition: all 0.4s ease-out;
  }
}
</style>
