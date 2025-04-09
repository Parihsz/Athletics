import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import './style.css'

import { Loader } from '@googlemaps/js-api-loader'
import { fetchLeaguesOnce } from '@/services/leagueService' 

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const loader = new Loader({
  apiKey: googleMapsApiKey,
  version: 'weekly',
  libraries: ['places']
})

Promise.all([
  loader.load(),
  fetchLeaguesOnce() 
]).then(async () => {
  console.log('[Startup] Google Maps and leagues loaded.')

  const { PlaceAutocompleteElement } = await google.maps.importLibrary('places')
  console.log('[Google Maps] PlaceAutocompleteElement loaded:', PlaceAutocompleteElement)

  createApp(App).use(router).mount('#app') 
}).catch(error => {
  console.error('[Startup Error]', error)
})
