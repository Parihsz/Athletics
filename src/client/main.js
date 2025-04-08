import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import './style.css'

import { Loader } from '@googlemaps/js-api-loader'

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const loader = new Loader({
  apiKey: googleMapsApiKey,
  version: 'weekly',
  libraries: ['places']
})

loader.load().then(async () => {
  console.log('[Google Maps] API loaded successfully.')
  const { PlaceAutocompleteElement } = await google.maps.importLibrary('places')
  console.log('[Google Maps] PlaceAutocompleteElement loaded:', PlaceAutocompleteElement)

  createApp(App).use(router).mount('#app')
})
