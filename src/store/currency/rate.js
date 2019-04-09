/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import { setLocal, getLocal } from '@/utils/storage';
import store from '@/store';
import * as api from '@/api/currency';
import { CURRENCY } from '@/store/types';
import currencyCodes from '@/assets/currency-codes';

export default {
  namespaced: true,
  state: {
    rate: 0,
    time: 0,
    chart: '',
    from: getLocal('store.currency.rate.from') || '人民币',
    to: getLocal('store.currency.rate.to') || '美元',
    cache: getLocal('store.currency.rate.cache') || [],
    lock: false,
  },
  getters: {},
  actions: {
    [CURRENCY.GET_RATE]({ commit, state }, { from, to }) {
      commit(CURRENCY.GET_RATE, { status: 'start', data: { from, to } });
      const fromCode = currencyCodes[state.from.toUpperCase()];
      const toCode = currencyCodes[state.to.toUpperCase()];
      const empty = !state.cache.find(c => c.from === from && c.to === to);
      const promise = new Promise((resolve, reject) => {
        api.getRate(fromCode || state.from, toCode || state.to, !empty).then((res) => {
          commit(CURRENCY.GET_RATE, { status: 'success', data: res.data });
          resolve();
        }).catch((err) => {
          commit(CURRENCY.GET_RATE, { status: 'failure' });
          reject(err);
        });
      });
      store.commit(`currency/list/${CURRENCY.GET_RATE}`, { from, to, fromCode, toCode }); // 这时候 fromCode 可能是空
      return empty ? promise : Promise.resolve();
    },
  },
  mutations: {
    [CURRENCY.GET_RATE](state, { status, data }) {
      if (status === 'start') {
        if (data) {
          if (data.from && data.from !== state.from) {
            state.from = data.from;
            setLocal('store.currency.rate.from', state.from);
          }
          if (data.to && data.to !== state.to) {
            state.to = data.to;
            setLocal('store.currency.rate.to', state.to);
          }
          const cache = state.cache.find(c => c.from === data.from && c.to === data.to);
          if (cache) {
            state.rate = cache.rate;
            state.time = cache.time;
            state.chart = cache.chart;
          } else {
            state.rate = 0;
            state.time = 0;
            state.chart = 'http://www.google.com/finance/chart?q=CURRENCY';
          }
        }
        state.lock = true;
      } else {
        if (status === 'success') {
          if (state.from === data.from && state.to === data.to) {
            state.rate = data.rate;
            state.time = data.time;
            state.chart = data.chart;
          }
          state.cache = state.cache
            .filter(c => c.from !== data.from || c.to !== data.to);
          while (state.cache.length >= 20) {
            state.cache.shift();
          }
          state.cache.push(data);
          setLocal('store.currency.rate.cache', state.cache);
          store.commit(`currency/list/${CURRENCY.GET_RATE}`, data);
        }
        state.lock = false;
      }
    },
  },
};
