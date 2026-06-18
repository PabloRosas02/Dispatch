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
      path: '/roles',
      name: 'role-detail',
      component: () => import('../views/RoleDetailView.vue'),
    },

    {
      path: '/reglas',
      name: 'rules-detail',
      component: () => import('../views/RulesPageView.vue'),
    },

    {
      path: '/housing',
      name: 'housing',
      component: () => import('../views/HousingView.vue'),
    },

    {
      path: '/controles',
      name: 'controls',
      component: () => import('../views/ControlesView.vue'),
    },

    {
      path: '/noticias',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../components/NotFound.vue'),
      props: {
        title: 'Page Not Found',
        description: 'La direccion URL no existe.',
      },
    },
  ],
})

export default router