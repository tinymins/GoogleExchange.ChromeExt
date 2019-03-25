/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import cheerio from 'cheerio';
import { setLocal, getLocal } from '@/utils/storage';
import * as api from '@/store/api/currency';
import { CURRENCY } from '@/store/types';

export default {
  namespaced: true,
  state: {
    rate: 0,
    chart: '',
    fromCurrency: getLocal('fromCurrency') || 'CNY',
    toCurrency: getLocal('toCurrency') || 'USD',
    lock: false,
  },
  getters: {},
  actions: {
    [CURRENCY.RATE_REQUEST]({ commit, state }, params) {
      commit(CURRENCY.RATE_REQUEST, params);
      return new Promise((resolve, reject) => {
        api.getRate(
          state.fromCurrency,
          state.toCurrency,
        ).then((res) => {
          commit(CURRENCY.RATE_SUCCESS, res);
          resolve();
        }).catch(() => {
          commit(CURRENCY.RATE_FAILURE);
          reject();
        });
      });
    },
  },
  mutations: {
    [CURRENCY.RATE_REQUEST](state, params) {
      if (params) {
        if (params.fromCurrency && params.fromCurrency !== state.fromCurrency) {
          state.fromCurrency = params.fromCurrency;
          setLocal('fromCurrency', state.fromCurrency);
        }
        if (params.toCurrency && params.toCurrency !== state.toCurrency) {
          state.toCurrency = params.toCurrency;
          setLocal('toCurrency', state.toCurrency);
        }
      }
      state.lock = true;
    },
    [CURRENCY.RATE_SUCCESS](state, html) {
      const $ = cheerio.load(html);
      state.rate = $('#knowledge-currency__tgt-amount').data('value');
      // state.chart = data.CurrencyUpdate[2];
      state.lock = false;
    },
    [CURRENCY.RATE_FAILURE](state) {
      state.lock = false;
    },
  },
};
