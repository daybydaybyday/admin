import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';//全局引入，会占用一些资源，但按需引入太麻烦
import 'element-ui/lib/theme-chalk/index.css';
import "./router/premit"
//自定义全局方法
import global from './utils/global'

//自定义全局组件
import './icons';

Vue.use(global)//全局注册 多文件引用
Vue.use(ElementUI);
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
