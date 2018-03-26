/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:11
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-02 23:51:12
 */

export default [
  {
    path: '/msg',
    name: 'msg',
    meta: { parent: 'msg', nav: 'msg', requiresAuth: true },
    redirect: { name: 'msg_test' },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/components/main.vue'),
      footer: () => import('@/components/footer.vue'),
    },
    children: [
      {
        name: 'msg_test',
        path: 'test',
        meta: { requiresAuth: true, title: 'Message' },
        component: () => import('@/views/msg/test.vue'),
      },
    ],
  },
];
