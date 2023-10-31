import { createApp } from 'vue';
import App from './App.vue';
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA0Wwb9ljUR0yJfSTF8z0TaN56D7PII5bM',
  },
});

app.mount('#app');