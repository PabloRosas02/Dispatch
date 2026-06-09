import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/roles/:id',
      name: 'role-detail',
      component: () => import('../views/RoleDetailView.vue'),
    },
  ],
})

export default router
