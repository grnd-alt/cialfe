import axios, { type AxiosResponse } from 'axios'
import { login, getToken, refresh, isAuthenticated } from '../services/keycloak'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
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

function createNote(note: { title: string; content: string }): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      console.log(getToken())
      console.log("THIS WAS THE TOKEN")
      axiosInstance
        .post('notes/create', note, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function getNotes(): Promise<AxiosResponse> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .get('notes', { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => resolve(res))
    })
  })
}

function getHello() {
  return axiosInstance.get('hello')
}

export { getMe, getHello, createNote,getNotes }
