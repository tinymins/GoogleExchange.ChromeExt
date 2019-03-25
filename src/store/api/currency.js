/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from './driver';

export const getList = () => http.get('https://www.google.com/search?q=usd+to+cny&gws_rd=cr');
export const getRate = (fromCurrency, toCurrency) => http.get('https://www.google.com/search', {
  q: `${fromCurrency} to ${toCurrency}`,
});
