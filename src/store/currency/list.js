/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import unescape from 'lodash/unescape';
import * as api from '@/api/currency';
import { CURRENCY } from '@/store/types';
import { setLocal, getLocal } from '@/utils/storage';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: getLocal('store.currency.list.list') || [],
    recent: getLocal('store.currency.list.recent') || [],
  },
  getters: {
    list(state) {
      const list = state.list.map(_ => _);
      const recent = state.recent;
      const findIndex = item => recent.findIndex(
        r => r.from === item.label || r.to === item.label,
      );
      list.sort((p1, p2) => findIndex(p2) - findIndex(p1));
      return list;
    },
  },
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
    [CURRENCY.GET_RATE](state, { from, to, fromCode, toCode }) {
      state.recent = state.recent
        .filter(c => (c.from !== from || c.to !== to) && (!fromCode || !toCode || c.fromCode !== fromCode || c.toCode !== toCode));
      while (state.recent.length >= 40) {
        state.recent.shift();
      }
      state.recent.push({ from, to, fromCode, toCode });
      setLocal('store.currency.list.recent', state.recent);
    },
  },
};
