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
          path: 'importation-drug-license',
          name: 'importation-drug-license',
          meta: { title: 'ขอใบอนุญาตนำเข้ายา', icon: 'pi pi-home' },
          component: () => import('../views/importation-drug/License.vue'),
        },
        {
          path: 'fda-approve-drug',
          name: 'fda-approve-drug',
          meta: { title: 'อย. แสดงความคิดเห็นใบอนุญาตนำเข้ายา', icon: 'pi pi-home' },
          component: () => import('../views/importation-drug/pda/PdaApproveList.vue'),
        },
        {
          path: 'excise-approve-drug',
          name: 'excise-approve-drug',
          meta: { title: 'กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้ายา', icon: 'pi pi-home' },
          component: () => import('../views/importation-drug/excise/ExciseApproveList.vue'),
        },
        {
          path: 'importation-material-license',
          name: 'importation-material-license',
          meta: { title: 'ขอใบอนุญาตนำเข้าวัตถุดิบยา', icon: 'pi pi-home' },
          component: () => import('../views/importation-material/License.vue'),
        },
        {
          path: 'fda-approve-material',
          name: 'fda-approve-material',
          meta: { title: 'อย. อนุมัติใบอนุญาตนำเข้าวัตถุดิบยา', icon: 'pi pi-home' },
          component: () => import('../views/importation-material/pda/PdaApproveList.vue'),
        },
        {
          path: 'license-status-log',
          name: 'license-status-log',
          meta: { title: 'สถานะการขออนุมัติใบอนุญาต', icon: 'pi pi-home' },
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
