/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 12:06:30
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

import { setLocal, getLocal } from '@/utils/storage';
import * as api from '@/store/api/currency';
import { CURRENCY } from '@/store/types';

export default {
  namespaced: true,
  state: {
    lock: false,
    list: [],
    rate: 0,
    rateLock: false,
    chart: '',
    kei: '',
    fromCurrency: getLocal('fromCurrency'),
    toCurrency: getLocal('toCurrency'),
  },
  getters: {},
  actions: {
    [CURRENCY.LIST_REQUEST]({ commit, state }, params) {
      commit(CURRENCY.LIST_REQUEST, params);
      return new Promise((resolve, reject) => {
        api.getList(
          'Fetching currency from google...',
        ).then((res) => {
          commit(CURRENCY.LIST_SUCCESS, res.data);
          resolve();
        }).catch(() => {
          commit(CURRENCY.LIST_FAILURE);
          reject();
        });
      });
    },
    [CURRENCY.RATE_REQUEST]({ commit, state }, params) {
      commit(CURRENCY.RATE_REQUEST, params);
      return new Promise((resolve, reject) => {
        api.getRate(
          'Fetching currency from google...',
          state.kei,
          state.fromCurrency,
          state.toCurrency,
        ).then((res) => {
          commit(CURRENCY.RATE_SUCCESS, res.data);
          resolve();
        }).catch(() => {
          commit(CURRENCY.RATE_FAILURE);
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
      const found = html.match(/<select id="knowledge-currency.*?<\/select/);
      if (found) {
        const part = found[0];
        const re = /<option[^>]*value\s*=\s*"([^"]*)"[^>]*>([^<]*)<\/option>/gi;
        let r = re.exec(part);
        const matched = !!r;
        while (r) {
          list.push({
            value: r[1],
            label: r[2],
          });
          r = re.exec(part);
        }
      }
      const kei = html.match(/kEI:'(\w+)'/);
      if (kei) {
        state.kei = kei[1];
      }
      state.list = list;
      state.lock = false;
    },
    [CURRENCY.LIST_FAILURE](state) {
      state.lock = false;
    },
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
      state.rateLock = true;
    },
    [CURRENCY.RATE_SUCCESS](state, html) {
      const json = html.replace(/^\)\]}'/, '');
      const data = JSON.parse(json);
      state.rate = data.CurrencyUpdate[0][0];
      state.chart = data.CurrencyUpdate[2];
      state.rateLock = false;
    },
    [CURRENCY.RATE_FAILURE](state) {
      state.rateLock = false;
    },
  },
};
