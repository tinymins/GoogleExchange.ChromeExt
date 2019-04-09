/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { AUTH_STATE_LIST } from '@/config';
import http from './driver';
import { HttpResponseData } from './driver/http';

export const getUser = (strict = true, silent = false): Promise<HttpResponseData> => http.get('user/profile', {
  strict: strict ? 'Y' : 'N',
}, {
  ignoreAuth: !strict,
  errcodeExpected: silent ? AUTH_STATE_LIST : [],
});
export const login = (phone, code): Promise<HttpResponseData> => http.post('login', { phone, code }, { modal: true });
export const logout = (): Promise<HttpResponseData> => http.delete('tokens/mine');
