import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    alias: '/home',
    meta: { title: 'Home' }
  },
  {
    path: '/league',
    name: 'league',
    component: () => import('@/views/league.vue'),
    meta: { requiresAuth: true, title: 'League' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: { title: 'Login' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved_position) {
    return (
      saved_position ||
      new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0, behavior: 'smooth' }), 300)
      })
    )
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title

  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})


export default router
