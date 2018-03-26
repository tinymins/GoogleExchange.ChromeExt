/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-12-04 14:02:25
 * @Last Modified by:   Emine Zhai (root@derzh.com)
 * @Last Modified time: 2018-03-26 17:47:57
 */
import cookie from 'cookie';

export const get = (k, opt = {}) => cookie.get(k, Object.assign({ path: '/' }, opt));
export const set = (k, v, opt = {}) => cookie.set(k, v, Object.assign({ path: '/' }, opt));
export const remove = (k, opt = {}) => cookie.remove(k, Object.assign({ path: '/' }, opt));
