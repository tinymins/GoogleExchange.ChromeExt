/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-08-22 20:26:19
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-02 23:51:24
 */
import { isDevelop } from '@/utils/util';

export default [
  {
    path: '/user',
    name: 'user',
    meta: { parent: 'user', nav: 'user' },
    redirect: { name: 'user_index' },
    components: {
      header: () => import('@/components/header'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'user_index',
        path: '',
        meta: { title: 'Me', requiresAuth: true },
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: 'user_login',
        path: 'login',
        redirect: { name: isDevelop() ? 'user_login_dev' : 'user_login_index' },
        component: () => import('@/components/main.vue'),
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { title: 'Login', requiresGuest: true },
            component: () => import('@/views/user/login.vue'),
          },
          {
            name: 'user_login_dev',
            path: 'dev',
            meta: { title: 'Dev Login', requiresGuest: true },
            component: () => import('@/views/user/login_dev.vue'),
          },
        ],
      },
    ],
  },
];
