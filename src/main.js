// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import store from './store'
// 引入全局变量组件
import Global from '@/components/Global'
// 引入静态常量
import constantData from '@/constants/constantData'
// 引入ajax
import axios from 'axios'
import VueAxios from 'vue-axios'
import utils from './util/index'
import utilVue from './util/utilVue'
import api from './api/index'
// 引入md5加密
import md5 from 'js-md5';
// 引入fastClick，解决点击延迟
import  FastClick  from  'fastclick'
FastClick.attach(document.body);
FastClick.prototype.focus = function(targetElement) {
  var length;
  var ua = navigator.userAgent.toLowerCase();
	var isIOS = (/iphone|ipod|ipad/gi).test(navigator.userAgent);
	var isAndroid = ua.indexOf("android") >= 0;
  if (isIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
      targetElement.focus();
  }
};

// 引入图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: require('./assets/image/default.png'),
  error:require('./assets/image/default.png'),
})
//引入vconsole调试工具
import vConsole from './assets/js/vConsole'
Vue.config.devtools = true;

// vant组件
import { Button } from 'vant';
import { Tab, Tabs } from 'vant';
import { Tabbar, TabbarItem  } from 'vant';
import { Swipe, SwipeItem,ImagePreview,DropdownMenu, DropdownItem } from 'vant';
import { Row, Col } from 'vant';
import { Panel } from 'vant';
import { Icon,List,Cell, CellGroup,Picker,DatetimePicker,NumberKeyboard,PasswordInput,Field,NoticeBar,Dialog,Circle ,Progress, Tag,RadioGroup,Radio} from 'vant';
import { NavBar } from 'vant';
import { Toast } from 'vant';
import { Popup,Uploader } from 'vant';
Vue.use(Button).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem).use(Row).use(Col).use(Panel).use(Icon).use(NavBar).use(List).use(Cell).use(CellGroup).use(Popup).use(Picker).use(DatetimePicker).use(NumberKeyboard).use(PasswordInput).use(Field).use(NoticeBar).use(Dialog).use(Circle).use(Progress).use(Tag).use(RadioGroup).use(Radio).use(Uploader).use(ImagePreview).use(DropdownMenu).use(DropdownItem);

Vue.use(VueAxios,axios);
// 全局变量
Vue.prototype.Global = Global;
// 静态常量
Vue.prototype.constantData = constantData;
// 公共方法函数
Vue.prototype.utils = utils;
Vue.use(utilVue);
// 接口地址
Vue.prototype.api = api;
// md5加密
Vue.prototype.$md5 = md5;
// toast提示
Vue.prototype.Toast = Toast;

// 阻止启动生产消息
Vue.config.productionTip = false;
// 引入echarts
let echarts = require('echarts/lib/echarts');
Vue.prototype.$echarts = echarts;
// 引入饼状图
require('echarts/lib/chart/pie');
// 引入柱状图
// require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

let AUTH_TOKEN=(function(){
  return localStorage.getItem("token");
})();

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function (config) {

  if (store.state.token) {
    config.headers.accessToken = store.state.token;
    config.headers.imei = store.state.imei;
    config.headers.project = 'east';
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

// 引入原生交互
import {
  AppCallBacks,
  AppCommendBackHandlers,
  AppCommendKeyboardBounceUp,
  AppMsgHandlers
} from './webApp/AppMsgHandlers'

import webApp from './webApp/index'

Vue.prototype.webApp = webApp;
Vue.prototype.WebBack = AppCommendBackHandlers;
Vue.prototype.Keyboar = AppCommendKeyboardBounceUp;

new Vue({
  el: '#app',
  components: { App },
  store,
  template: '<App/>',
  router,
});
