import { getToken } from '@/services/keycloak'
import { axiosInstance, ensureAuth } from './api'
import type { Counter } from '@/types/Counter'
import type { UserInCounter, UserSearchResult } from '@/types/User'

type UserInput = UserSearchResult | UserInCounter

export async function createCounter(name: string, icon: string, users: UserInput[]): Promise<Counter> {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          'counters',
          { name, icon, users },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        ).then((res) => {
          resolve(res.data as Counter)
        })
      })
    })
}

export async function updateCounter(name: string, icon: string, users: UserInput[], id: number): Promise<Counter> {
  return new Promise((resolve, reject) => {
    ensureAuth().then(() => {
      axiosInstance
        .put(
          `counters/${id}`,
          { name, icon, users },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        ).then((res) => {
          if (res.status !== 200) {
            reject(res.data)
          }
          resolve(res.data as Counter)
        })
        .catch((err) => reject(err))
    }).catch((err) => reject(err))
  })
}

export async function getCounters(username: string):Promise<Counter[] | null> {
  return new Promise((resolve, reject) => {
    ensureAuth().then(() => {
      axiosInstance
        .get(`users/${username}/counters`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => {
          if (res.status !== 200) {
            reject(res.data)
          }
          resolve(res.data as Counter[] | null)
        })
    })
  })
}

export async function getCounter(id: number): Promise<Counter | null> {
  return new Promise((resolve, reject) => {
    ensureAuth().then(() => {
      axiosInstance
        .get(`counters/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => {
          if (res.status !== 200) {
            reject(res.data)
          }
          resolve({...res.data.counter, Users: [...res.data.users]} as Counter | null)
        })
        .catch((err) => reject(err))
    }).catch((err) => reject(err))
  })
}

export async function addEvent(id: number) {
  return new Promise((resolve) => {
    ensureAuth().then(() => {
      axiosInstance
        .post(
          `counters/${id}/events/add`,
          {},
          { headers: { Authorization: `Bearer ${getToken()}` } }
        ).then((res) => {
          resolve(res)
        })
    })
  })
}
