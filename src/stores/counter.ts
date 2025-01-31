import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getMe, getPosts } from '@/api/api'
import type { PostData } from '@/types/Post'

type Me = {
  sub: string,
  preferred_username: string,
  email: string,
  exp: number,
}

export const useMeStore = defineStore("me", {
  state: () => ({ me: undefined as Me | undefined }),
  actions: {
    async getMe():Promise<Me | undefined> {
      if (!this.me) {
        this.me = (await getMe()).data
      }
      return (this.me as Me)
    }
  },
})

export const usePostStore = defineStore('posts',{
  state: () => ({ mePosts: [] as PostData[] }),
  actions: {
    async getMePosts():Promise<PostData[]> {
      const meStore = useMeStore()
      if (!this.mePosts.length) {
        this.mePosts = (await getPosts((await meStore.getMe())!.preferred_username,0)).data
      }
      return this.mePosts
    },
    removePost(id: string) {
      this.mePosts = this.mePosts.filter((post) => post.Post.ID !== id)
    },
    addPost(post: PostData) {
      this.mePosts.unshift(post)
    },
  }
}
)

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
