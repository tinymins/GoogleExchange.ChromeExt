/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import cheerio from 'cheerio';
import escapeRegExp from 'lodash/escapeRegExp';
import { setLocal, getLocal } from '@/utils/storage';
import * as api from '@/store/api/currency';
import { CURRENCY } from '@/store/types';
import currencyCodes from '@/assets/currency-codes';

export default {
  namespaced: true,
  state: {
    rate: 0,
    chart: '',
    fromCurrency: getLocal('fromCurrency') || '人民币',
    toCurrency: getLocal('toCurrency') || '美元',
    lock: false,
  },
  getters: {},
  actions: {
    [CURRENCY.GET_RATE]({ commit, state }, params) {
      commit(CURRENCY.GET_RATE, { status: 'start', data: params });
      return new Promise((resolve, reject) => {
        api.getRate(
          state.fromCurrency,
          state.toCurrency,
        ).then((res) => {
          commit(CURRENCY.GET_RATE, { status: 'success', data: res });
          resolve();
        }).catch((err) => {
          commit(CURRENCY.GET_RATE, { status: 'failure' });
          reject(err);
        });
      });
    },
  },
  mutations: {
    [CURRENCY.GET_RATE](state, { status, data }) {
      if (status === 'start') {
        if (data) {
          if (data.fromCurrency && data.fromCurrency !== state.fromCurrency) {
            state.fromCurrency = data.fromCurrency;
            setLocal('fromCurrency', state.fromCurrency);
          }
          if (data.toCurrency && data.toCurrency !== state.toCurrency) {
            state.toCurrency = data.toCurrency;
            setLocal('toCurrency', state.toCurrency);
          }
        }
        state.lock = true;
      } else {
        if (status === 'success') {
          const $ = cheerio.load(data);
          state.rate = $('#knowledge-currency__tgt-amount').data('value');
          const regexFromCurrency = new RegExp(`${escapeRegExp(state.fromCurrency)}\\s*\\((\\w+)\\)`, 'iu');
          const regexToCurrency = new RegExp(`${escapeRegExp(state.toCurrency)}\\s*\\((\\w+)\\)`, 'iu');
          let fromCurrencyCode = currencyCodes[state.fromCurrency];
          let toCurrencyCode = currencyCodes[state.toCurrency];
          if (!fromCurrencyCode || !toCurrencyCode) {
            $('em').each((i, el) => {
              const text = $(el).parent().text();
              const resFromCurrency = regexFromCurrency.exec(text);
              if (resFromCurrency && !fromCurrencyCode) {
                fromCurrencyCode = resFromCurrency[1];
              }
              const resToCurrency = regexToCurrency.exec(text);
              if (resToCurrency && !toCurrencyCode) {
                toCurrencyCode = resToCurrency[1];
              }
            });
          }
          state.chart = fromCurrencyCode && toCurrencyCode
            ? `http://www.google.com/finance/chart?q=CURRENCY:${fromCurrencyCode}${toCurrencyCode}&tkr=1&p=5Y&chst=cob`
            : 'http://www.google.com/finance/chart?q=CURRENCY';
        }
        state.lock = false;
      }
    },
  },
};
