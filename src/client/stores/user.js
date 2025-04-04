import { ref } from 'vue'
import {jwtDecode} from 'jwt-decode'

const token = localStorage.getItem('token')
const user = ref(token ? jwtDecode(token) : null)

function login(tokenStr) {
  localStorage.setItem('token', tokenStr)
  user.value = jwtDecode(tokenStr)
}

function logout() {
  localStorage.removeItem('token')
  user.value = null
}

export function useUser() {
  return { user, login, logout }
}
