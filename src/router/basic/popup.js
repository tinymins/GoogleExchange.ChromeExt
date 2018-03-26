/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 13:42:33
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-04 11:53:57
 */

export default [
  {
    name: 'popup',
    path: '/popup',
    meta: { parent: 'popup', nav: 'popup', title: 'Popup' },
    components: {
      header: () => import('@/components/main.vue'),
      main: () => import('@/views/popup/index.vue'),
      footer: () => import('@/components/main.vue'),
    },
  },
];
