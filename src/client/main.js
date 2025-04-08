import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import './style.css'

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const script = document.createElement('script')
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
script.async = true
script.defer = true
document.head.appendChild(script)

createApp(App).use(router).mount('#app')
