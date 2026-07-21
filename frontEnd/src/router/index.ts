import { createRouter, createWebHistory, RouterView } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

   scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Kinsfolk'
      }
    },

    {
      path: '/roles',
      name: 'role-root',
      component: RouterView,
      children: [
        {
          path: ':serverId',
          name: 'role-detail',
          component: () => import('../views/RoleDetailView.vue'),
        }
      ],
      meta: {
        hideLayout: true,
        title: 'Roles'
      }
    },
    {
      path: '/normativas',
      meta: {
        title: 'Normativas'
      },
      children: [
        {
          path: '',
          name: 'rules-index',
          component: () => import('../views/RulesIndexView.vue'),
        },
        {
          path: ':serverId',
          name: 'rules-detail',
          component: () => import('../views/RulesPageView.vue'),
        }
      ]
    },
    {
      path: "/housing",
      name: "housing-home",
      component: () => import("../views/housing/HousingHomeView.vue"),
      meta: {
        title: "Housing",
      },
    },
    {
      path: "/housing/:zoneId",
      name: "housing-zone",
      component: () => import("../views/housing/HousingZoneView.vue"),
      meta: {
        title: "Housing",
      },
    },
    {
      path: "/housing/:zoneId/:interiorId",
      name: "housing-interior",
      component: () => import("../views/housing/HousingInteriorView.vue"),
      meta: {
        title: "Housing",
      },
    },
    {
      path: '/controles',
      name: 'controls',
      component: () => import('../views/ControlesView.vue'),
      meta: {
        title: 'Controles'
      }
    },

    {
      path: '/noticias',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
      meta: {
        title: 'Noticias'
      }
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../components/miscellaneous/NotFound.vue'),
      meta: {
        title: 'Page Not Found'
      },
      props: {
        title: 'Page Not Found',
        description: 'La direccion URL no existe.',
      },
    },
  ],
})

router.beforeEach((to) => {
  const baseTitle = to.meta.title as string || 'Kinsfolk';


  switch (to.name) {
    case 'role-detail':
    case 'rules-detail':
      const serverId = to.params.serverId as string;
      document.title = serverId ? `${baseTitle} - Servidor ${serverId}` : baseTitle
      break;
    default:
      document.title = baseTitle;
      break;
  }

  return true
})

export default router
