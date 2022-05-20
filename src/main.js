import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';//全局引入，会占用一些资源，但按需引入太麻烦
import 'element-ui/lib/theme-chalk/index.css';

//自定义全局组件
import './icons';


Vue.use(ElementUI);
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
