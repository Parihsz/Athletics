import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bulma/css/bulma.css'
import './style.css'

console.log('Openrouteservice API Key:', import.meta.env.VITE_ORS_API_KEY)

createApp(App).use(router).mount('#app')
