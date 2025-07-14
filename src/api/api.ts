import axios, { type AxiosResponse } from 'axios'
import { login, getToken, refresh, isAuthenticated } from '../services/keycloak'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeoutErrorMessage: 'Request timed out. Please try again later.',
  validateStatus: (status) => {
    return status >= 200 && status < 500 // Accept all 2xx and 4xx responses
  },
})

async function ensureAuth(): Promise<boolean> {
  if (!isAuthenticated()) {
    login()
  }
  try {
    return await refresh()
  } catch (error) {
    login()
    return await Promise.reject(error)
  }
}

export function getMedia(imageUrl: string): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    axiosInstance.get(imageUrl, {responseType: 'blob'}).then((res) => resolve(res))
  })
}

function getVapiKey(): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    axiosInstance.get('vapid').then((res) => {
      resolve(res)
    })
  })
}

function updateBrowserData(subscription: PushSubscription): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          'users/update-browser-data',
          { subscription },
          { headers: { Authorization: `Bearer ${getToken()}` } },
        )
        .then((res) => resolve(res))
    })
  })
}

function getMe(): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get('me', { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => {
          resolve(res)
        })
    })
  })
}

function getUser(userId: string): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get(`users/${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function follow(userName: string, subscription: PushSubscription | null): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          `users/follow/${userName}`,
          { subscription: subscription || {} },
          { headers: { Authorization: `Bearer ${getToken()}` } },
        )
        .then((res) => resolve(res))
    })
  })
}
function unfollow(userName: string): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          `users/unfollow/${userName}`,
          {},
          { headers: { Authorization: `Bearer ${getToken()}` } },
        )
        .then((res) => resolve(res))
    })
  })
}

function createPost(post: { content: string; file: File }): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    ensureAuth().then(() => {
      axiosInstance
        .post('posts/create', post, {
          headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => resolve(res))
        .catch((error) => {
          reject(error)
        })
    })
  })
}

function getPosts(username: string, page: number): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get(`posts/${username}`, {
          params: { page },
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        .then((res) => resolve(res))
    })
  })
}

function getLatest(page: number): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get('posts', { params: { page }, headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function createComment(content: string, postId: string): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          'comments/create',
          { content: content, post_id: postId },
          { headers: { Authorization: `Bearer ${getToken()}` } },
        )
        .then((res) => resolve(res))
    })
  })
}
function getCommentsByPost(postId: string, pageNumber = 0): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get(`comments/${postId}?page=${pageNumber}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        .then((res) => resolve(res))
    })
  })
}

function deletePost(postId: string): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .delete(`posts/${postId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function getHello() {
  return axiosInstance.get('hello')
}

export {
  getLatest,
  getMe,
  getHello,
  createPost,
  getPosts,
  createComment,
  getCommentsByPost,
  deletePost,
  getUser,
  follow,
  unfollow,
  updateBrowserData,
  getVapiKey,
}
