/**
 * @Author: William Chan
 * @Date:   2017-04-27 15:49:15
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-02 23:51:17
 */

export default [
  {
    path: '/secret',
    name: 'secret',
    meta: { parent: 'secret', nav: 'secret' },
    redirect: { name: 'secret_index' },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/components/main.vue'),
      footer: () => import('@/components/footer.vue'),
    },
    children: [
      {
        name: 'secret_index',
        path: '',
        meta: { requiresAuth: true, title: '秘密列表' },
        component: () => import('@/views/secret/index.vue'),
      },
    ],
  },
  {
    name: 'secret_posts',
    path: '/secret/posts/:id',
    main: () => import('@/views/secret/posts.vue'),
  },
];
