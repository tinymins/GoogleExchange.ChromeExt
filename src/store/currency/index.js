/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */
import rateModule from './rate';
import listModule from './list';

export default {
  namespaced: true,
  modules: {
    rate: rateModule,
    list: listModule,
  },
  state: {},
  getters: {},
  actions: {},
  mutations: {},
};
