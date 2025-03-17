<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">Admin Login</h1>
      <div class="box" style="max-width: 400px; margin: auto;">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input v-model="username" class="input" type="text" placeholder="Enter username" />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="Enter password" />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary is-fullwidth" @click="handleLogin">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')

function handleLogin() {
  if (username.value && password.value) {
    window.user = {
      username: username.value,
    }
    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)
  } else {
    alert('Please enter username and password')
  }
}
</script>
