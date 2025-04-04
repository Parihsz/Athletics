import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://athletics-ziq2.onrender.com/' 
    : '/api'
})

export default api
