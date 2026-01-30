import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

/**
 * we need this wrapper function as createWebHistory can not be called before keycloak finished
 * Otherwise the #state is still in the url
 * @returns the router object
 */
function makeRouter() {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/me',
        name: 'me',
        component: () => import('../views/UserView.vue'),
      },
      {
        path: '/user/:username',
        name: 'user',
        component: () => import('../views/UserView.vue'),
      },
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: '/counter/:counterID/addEvent',
        name: 'addEvent',
        component: () => import('../views/AddCounterEventView.vue'),
      },
      {
        path: '/create',
        name: 'create',
        component: () => import('../components/posts/CreatePost.vue'),
      },
    ],
  })
}

export { makeRouter }
