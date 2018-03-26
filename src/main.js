// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui

import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import 'normalize.css';
import router from '@/router';
import { store } from '@/store';
import { isOnDemandComponents } from '@/config';
import '../static/js/flexible';

Vue.config.productionTip = false;

// load different framework
const promises = [];
if (!isOnDemandComponents) {
  promises.push(new Promise((resolve, reject) => {
    import('element-ui').then((ElementUI) => {
      Vue.use(ElementUI);
      resolve();
    }).catch(reject);
  }));
  promises.push(import('element-ui/lib/theme-default/index.css'));
}
promises.push(import('@/styles/main.scss'));

Promise.all(promises).then(() => {
  /* eslint-disable no-new */
  sync(store, router);
  const promise = import('@/App');
  promise.then((App) => {
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    });
  });
});
