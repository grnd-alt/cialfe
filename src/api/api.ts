import axios, { type AxiosResponse } from 'axios'
import { login, getToken, refresh, isAuthenticated } from '../services/keycloak'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 5000,
})

function ensureAuth(): Promise<boolean> {
  if (!isAuthenticated()) {
    login()
  }
  return refresh().catch((error) => {
    login()
    return Promise.reject(error)
  })
}

function getMe(): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get('me', { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function createPost(post: { content: string; file: File }): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post('posts/create', post, {
          headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => resolve(res))
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

function getHello() {
  return axiosInstance.get('hello')
}

export { getLatest, getMe, getHello, createPost, getPosts, createComment }
