/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import unescape from 'lodash/unescape';
import { setLocal, getLocal } from '@/utils/storage';
import * as api from '@/store/api/currency';
import { CURRENCY } from '@/store/types';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: getLocal('store.currency.list.list') || [],
  },
  getters: {},
  actions: {
    [CURRENCY.GET_LIST]({ state, commit }) {
      commit(CURRENCY.GET_LIST, { status: 'start' });
      const empty = state.list.length === 0;
      const promise = new Promise((resolve, reject) => {
        api.getList(!empty).then((res) => {
          commit(CURRENCY.GET_LIST, { status: 'success', data: res });
          resolve();
        }).catch((err) => {
          commit(CURRENCY.GET_LIST, { status: 'failure' });
          reject(err);
        });
      });
      return empty ? promise : Promise.resolve();
    },
  },
  mutations: {
    [CURRENCY.GET_LIST](state, { status, data }) {
      if (status === 'start') {
        state.lock = true;
      } else {
        if (status === 'success') {
          const list = [];
          const found = data.match(/<select id="knowledge-currency.*?<\/select/u);
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
          setLocal('store.currency.list.list', state.list);
        }
        state.lock = false;
      }
    },
  },
};
