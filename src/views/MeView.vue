<script setup lang="ts">
import { getMe, createNote,getNotes } from '@/api/api'
import { ref, onUnmounted } from 'vue'

const me = ref()
const countdown = ref<string>('')

const noteTitle = ref<string>('')
const noteContent = ref<string>('')
const notes = ref<Array<object>>([])

function loadNotes() {
  getNotes().then((res) => (notes.value = res.data))
}
loadNotes()

function onSubmit(event: Event) {
  event.preventDefault()
  createNote({ title: noteTitle.value, content: noteContent.value }).then(
    (res) => {
      if (!notes.value) {
        notes.value = []
      }
      notes.value.unshift(res.data)
    }
  )
}

getMe().then((res) => {
  me.value = res.data
  startCountdown()
})

let intervalId: number | null = null

function startCountdown() {
  if (me.value && me.value.exp) {
    updateCountdown()
    intervalId = setInterval(updateCountdown, 1000)
  }
}

function updateCountdown() {
  if (me.value && me.value.exp) {
    const now = new Date().getTime()
    const expTime = me.value.exp * 1000
    const timeLeft = expTime - now

    if (timeLeft <= 0) {
      countdown.value = 'Token has expired'
      clearInterval(intervalId!)
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      countdown.value = `${hours}h ${minutes}m ${seconds}s`
    }
  }
}

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <main>
    <div>
      <h1>Me</h1>
      <p v-if="me && me.preferred_username">Hello, {{ me.preferred_username }}!</p>
      <p v-if="countdown">{{ countdown }}</p>
      <form @submit="onSubmit">
        <label for="note-tile">Title</label>
        <input type="text" id="note-title" v-model="noteTitle" required />
        <label for="note-tile">Content</label>
        <input type="text" id="note-content" v-model="noteContent" required />
        <input type="submit" value="submit" />
      </form>
      <div class="note" v-for="note in notes" :key="note.ID">
        <h3>{{ note.Title }}</h3>
        <span>{{ note.Content }}</span>
      </div>
    </div>
  </main>
</template>
<style scoped>
.note {
  margin-top: 1rem;
  border: 1px solid #ccc;
  h3{
    margin: 0;
    padding: 0.5rem;
  }
}
</style>
