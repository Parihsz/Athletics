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
import { useUser } from '@/stores/user'
import api from '@/api' 

const router = useRouter()
const route = useRoute()
const { login } = useUser()

const username = ref('')
const password = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    alert('Please enter username and password')
    return
  }

  try {
    const { data } = await api.post('/login', {
      username: username.value,
      password: password.value
    })

    login(data.token)

    const redirectPath = route.query.redirect || '/dashboard'
    router.push(redirectPath)

  } catch (err) {
    alert(err.response?.data?.message || err.message)
  }
}
</script>



