<template>
  <nav class="navbar custom-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item brand-item">
        <img src="/vite.svg" alt="Logo" class="logo" />
        <span class="brand-text">Athletics</span>
      </router-link>
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': is_menu_active }"
        aria-label="menu"
        aria-expanded="false"
        @click="TOGGLE_MENU"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': is_menu_active }">
      <div class="navbar-end">
        <span v-if="user" class="navbar-item has-text-weight-semibold">
          Welcome, {{ user.username }}
        </span>

        <router-link
          v-if="user"
          to="/league"
          class="navbar-item nav-link"
        >
          Leagues
        </router-link>

        <router-link
          v-if="user"
          to="/dashboard"
          class="navbar-item nav-link"
        >
          Admin
        </router-link>

        <router-link
          v-if="!user"
          to="/login"
          class="navbar-item nav-link"
        >
          Login
        </router-link>

        <a
          v-if="user"
          @click="handleLogout"
          class="navbar-item nav-link"
          style="cursor: pointer;"
        >
          Logout
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'

const { user, logout } = useUser()
const router = useRouter()

const is_menu_active = ref(false)

function TOGGLE_MENU() {
  is_menu_active.value = !is_menu_active.value
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.custom-navbar {
  background-color: #fff;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 0 1rem;
}
.custom-navbar::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000, #f3f0ff);
  box-shadow: 0 0 4px rgba(237, 233, 254, 0.5), 0 0 8px rgba(237, 233, 254, 0.5);
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.brand-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
}
.logo {
  height: 36px;
  width: auto;
}
.brand-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  font-family: sans-serif;
}
.nav-link {
  color: #333 !important;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.router-link-active {
  background-color: rgba(0, 0, 0, 0.1);
}
.navbar-burger span {
  background-color: #333;
}
</style>
