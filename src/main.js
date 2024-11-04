

import { createApp } from "vue";
import { createPinia } from "pinia";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// import App from './App.vue'
import router from "./router";
import Dashboard from "./Dashboard.vue";

const app = createApp(Dashboard);
const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
app.use(router);
app.use(createPinia());

app.mount("#app");
