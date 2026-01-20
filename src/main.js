import { createPinia } from "pinia";
import { createApp } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import App from "./App.vue";
import router from "./router/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth } from "./utility/firebaseConfig";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);

let isMounted = false;
onAuthStateChanged(auth, async user => {
  if (!isMounted) {
    app.mount("#app");
    isMounted = true;
  }
});
