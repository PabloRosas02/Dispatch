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
      path: '/roles/:serverId',
      name: 'role-detail',
      component: () => import('../views/RoleDetailView.vue'),
    },
    {
      path: '/reglas/:serverId',
      name: 'rules-detail',
      component: ()=> import ('../views/RulesPageView.vue'),
    },
    {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ()=> import ('../components/NotFound.vue'),
    // Optional: Pass specific error details directly via props
    props: {
      title: 'Page Not Found',
      description: 'La direccion URL no existe.',
    }
  }
  ],
})

export default router
