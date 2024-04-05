import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          meta: { title: 'หน้าแรก', icon: 'pi pi-home' },
          component: () => import('../views/Index.vue'),
        },
        {
          path: 'importation-license',
          name: 'importation-license',
          meta: { title: 'ขอใบอนุญาตนำเข้า', icon: 'pi pi-home' },
          component: () => import('@/views/importation/License.vue'),
        },
        {
          path: 'importation-license-approve',
          name: 'importation-license-approve',
          meta: { title: 'อนุมัติใบอนุญาตนำเข้า', icon: 'pi pi-home' },
          component: () => import('../views/importation/ApproveList.vue'),
        },
        {
          path: 'license-status-log',
          name: 'license-status-log',
          meta: { title: 'สถานะการขออนุมัติใบอนุญาตนำเข้า', icon: 'pi pi-home' },
          component: () => import('../views/StatusLog.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      meta: { title: 'Error404' },
      component: () => import('../views/Error404.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: 'เข้าสู่ระบบ', icon: 'pi pi-bitcoin' },
      component: () => import('../views/auth/Login.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `POC · ${to.meta.title}`;
  next();
});

export default router;

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    isAuth?: boolean;
  }
}
