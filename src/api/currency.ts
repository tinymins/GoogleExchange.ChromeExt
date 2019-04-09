/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import cheerio from 'cheerio';
import escapeRegExp from 'lodash/escapeRegExp';
import currencyCodes from '@/assets/currency-codes';
import http from './driver';
import { HttpResponseData } from './driver/http';

interface ListItem {
  label: string;
  value: string;
}

export const getList = (silent): Promise<HttpResponseData<ListItem[]>> => new Promise((resolve, reject) => {
  http.get<string>('https://www.google.com/search?q=usd+to+cny&gws_rd=cr', {}, { silent }).then((res) => {
    const list: ListItem[] = [];
    const found = res.data.match(/<select id="knowledge-currency.*?<\/select/u);
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
    resolve({ errcode: 0, errmsg: '', data: list });
  }).catch(reject);
});

export const getRate = (fromCurrency, toCurrency, silent): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get<string>('https://www.google.com/search', {
    q: `${fromCurrency} to ${toCurrency}`,
  }, { silent }).then((res) => {
    const $ = cheerio.load(res.data);
    const reFrom = new RegExp(`${escapeRegExp(fromCurrency)}\\s*\\((\\w+)\\)`, 'iu');
    const reTo = new RegExp(`${escapeRegExp(toCurrency)}\\s*\\((\\w+)\\)`, 'iu');
    let fromCode = currencyCodes[fromCurrency];
    let toCode = currencyCodes[toCurrency];
    if (!fromCode || !toCode) {
      $('em').each((_, el) => {
        const text = $(el).parent().text();
        const resFrom = reFrom.exec(text);
        if (resFrom && !fromCode) {
          fromCode = resFrom[1];
        }
        const resTo = reTo.exec(text);
        if (resTo && !toCode) {
          toCode = resTo[1];
        }
      });
    }
    const data = {
      from: fromCurrency,
      to: toCurrency,
      fromCode,
      toCode,
      rate: $('#knowledge-currency__tgt-amount').data('value'),
      time: (new Date()).valueOf(),
      chart: fromCode && toCode
        ? `http://www.google.com/finance/chart?q=CURRENCY:${fromCode}${toCode}&tkr=1&p=5Y&chst=cob`
        : 'http://www.google.com/finance/chart?q=CURRENCY',
    };
    resolve({ errcode: 0, errmsg: '', data });
  }).catch(reject);
});
