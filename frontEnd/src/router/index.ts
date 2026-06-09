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
    {
      path: '/reglas/:serverId',
      name: 'rules-detail',
      component: ()=> import ('../views/RulesPageView.vue'),
    },
  ],
})

export default router
