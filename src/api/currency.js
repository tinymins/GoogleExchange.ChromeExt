/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from './driver';

export const getList = silent => http.get('https://www.google.com/search?q=usd+to+cny&gws_rd=cr', {}, { silent });
export const getRate = (fromCurrency, toCurrency, silent) => http.get('https://www.google.com/search', {
  q: `${fromCurrency} to ${toCurrency}`,
}, { silent });
