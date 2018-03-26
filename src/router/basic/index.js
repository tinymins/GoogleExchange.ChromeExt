/**
 * @Author: William
 * @Date:   2017-04-27 15:49:02
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-04 12:14:48
 */

export default [
  {
    path: '/',
    meta: { parent: 'index', nav: 'index' },
    redirect: { name: 'index' },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/components/main.vue'),
      footer: () => import('@/components/footer.vue'),
    },
    children: [
      {
        name: 'index',
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/index/index.vue'),
      },
    ],
  },
  {
    path: '*',
    name: '404',
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/views/index/404.vue'),
      footer: () => import('@/components/footer.vue'),
    },
  },
];
