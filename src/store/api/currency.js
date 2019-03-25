/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from './driver';

export const getList = loadingText => http.get('https://www.google.com/search?q=usd+to+cny&gws_rd=cr', {}, { loadingText });
export const getRate = (loadingText, kei, fromCurrency, toCurrency) => http.get('https://www.google.com/async/currency_update', {
  ei: kei,
  safe: 'strict',
  yv: 2,
  async: `source_amount:1,source_currency:${fromCurrency},target_currency:${toCurrency},chart_width:270,chart_height:94,lang:en,country:,_fmt:jspb`,
}, { loadingText });
