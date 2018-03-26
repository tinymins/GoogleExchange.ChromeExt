/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:47:33
*/

import { http } from '@/store/api';

export const getList = loadingText => http.get('https://www.google.com.hk/search?q=usd+to+cny&gws_rd=cr', { loadingText });
export const getRate = (loadingText, kei, fromCurrency, toCurrency) => http.get('https://www.google.com.hk/async/currency_update', {
  loadingText,
  params: {
    ei: kei,
    safe: 'strict',
    yv: 2,
    async: `source_amount:1,source_currency:${fromCurrency},target_currency:${toCurrency},chart_width:270,chart_height:94,lang:en,country:,_fmt:jspb`,
  },
});
