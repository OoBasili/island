import Vue from 'vue';
import App from '@/App.vue';
import store from '@/store';
import { VNode } from 'vue/types/umd';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h): VNode => h(App),
}).$mount('#app');
