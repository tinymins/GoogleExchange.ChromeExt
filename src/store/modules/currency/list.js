/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import unescape from 'lodash/unescape';
import * as api from '@/store/api/currency';
import { CURRENCY } from '@/store/types';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: [],
  },
  getters: {},
  actions: {
    [CURRENCY.LIST_REQUEST]({ commit }, params) {
      commit(CURRENCY.LIST_REQUEST, params);
      return new Promise((resolve, reject) => {
        api.getList().then((res) => {
          commit(CURRENCY.LIST_SUCCESS, res);
          resolve();
        }).catch(() => {
          commit(CURRENCY.LIST_FAILURE);
          reject();
        });
      });
    },
  },
  mutations: {
    [CURRENCY.LIST_REQUEST](state) {
      state.lock = true;
    },
    [CURRENCY.LIST_SUCCESS](state, html) {
      const list = [];
      const found = html.match(/<select id="knowledge-currency.*?<\/select/u);
      if (found) {
        const part = found[0];
        const re = /<option[^>]*value\s*=\s*"([^"]*)"[^>]*>([^<]*)<\/option>/giu;
        let r = re.exec(part);
        while (r) {
          const value = unescape(r[2]);
          list.push({
            value,
            label: value,
          });
          r = re.exec(part);
        }
      }
      state.list = list;
      state.lock = false;
    },
    [CURRENCY.LIST_FAILURE](state) {
      state.lock = false;
    },
  },
};
