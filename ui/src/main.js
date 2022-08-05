import "./filters"
import "moment/locale/fr"
import "./utils/global"

import App from "./App.vue"
import BootstrapVue from "bootstrap-vue"
import Vue from "vue"
import VueCompositionAPI from "@vue/composition-api"
import VueI18n from "vue-i18n"
import VueMoment from "vue-moment"
import NProgress from "vue-nprogress"

import VueRouter from "vue-router"
import VueSidebarMenu from "vue-sidebar-menu"
import Vuex from "vuex";
import VueAnalytics from "vue-analytics";

import configureHttp from "./http"
import Toast from "./utils/toast";
import {extendMoment} from "moment-range";
import Translations from "./translations.json"
import moment from "moment"
import routes from "./routes/routes"
import stores from "./stores/store"
import vSelect from "vue-select"
import VueHotkey from "v-hotkey"

import TaskString from "./components/flows/tasks/TaskString.vue";
import TaskDynamic from "./components/flows/tasks/TaskDynamic.vue";
import TaskNumber from "./components/flows/tasks/TaskNumber.vue";
import TaskEnum from "./components/flows/tasks/TaskEnum.vue";
import TaskBoolean from "./components/flows/tasks/TaskBoolean.vue";
import TaskObject from "./components/flows/tasks/TaskObject.vue";
import TaskDict from "./components/flows/tasks/TaskDict.vue";
import TaskArray from "./components/flows/tasks/TaskArray.vue";
import TaskTask from "./components/flows/tasks/TaskTask.vue";
import TaskRoot from "./components/flows/tasks/TaskRoot.vue";

Vue.component("TaskString", TaskString);
Vue.component("TaskDynamic", TaskDynamic);
Vue.component("TaskNumber", TaskNumber);
Vue.component("TaskInteger", TaskNumber);

Vue.component("TaskEnum", TaskEnum);
Vue.component("TaskBoolean", TaskBoolean);
Vue.component("TaskObject", TaskObject);
Vue.component("TaskArray", TaskArray);
Vue.component("TaskTask", TaskTask);
Vue.component("TaskDict", TaskDict);
Vue.component("TaskRoot", TaskRoot)

import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Filler
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Filler
);

let app = document.querySelector("#app");

if (app) {
  Vue.use(VueCompositionAPI)
  Vue.use(Vuex)
  let store = new Vuex.Store(stores);

  Vue.use(VueRouter);
  let router = new VueRouter(routes);

  /* eslint-disable */
  if (KESTRA_GOOGLE_ANALYTICS !== null) {
    Vue.use(VueAnalytics, {
      id: KESTRA_GOOGLE_ANALYTICS,
      router
    });
  }
  /* eslint-enable */

  Vue.use(VueI18n);

  let locale = localStorage.getItem("lang") || "en";

  let i18n = new VueI18n({
    locale: locale,
    messages: Translations
  });

  moment.locale(locale)

  const nprogress = new NProgress()
  Vue.use(NProgress, {
    latencyThreshold: 50,
  })

  Vue.use(VueHotkey)
  Vue.use(VueMoment, {moment: extendMoment(moment)});
  Vue.use(VueSidebarMenu);
  Vue.use(BootstrapVue);

  Vue.use(Toast)

  Vue.component("VSelect", vSelect);

  Vue.config.productionTip = false;

  configureHttp(() => {
    new Vue({
      render: h => h(App),
      router: router,
      store,
      i18n,
      nprogress
    }).$mount(app)
  }, store, nprogress);
}
