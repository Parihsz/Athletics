import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Loader } from '@googlemaps/js-api-loader';

import 'bulma/css/bulma.css';
import './style.css';

const app = createApp(App).use(router);

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loader = new Loader({
  apiKey: googleMapsApiKey,
  libraries: ['places'],
});

loader.load().then(() => {
  console.log('[Google Maps] API loaded successfully.');
  app.mount('#app');
}).catch(error => {
  console.error('[Google Maps] API failed to load:', error);
});
