<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  try {
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: 'include' // viktigt för cookie
    })

    if (!res.ok) throw new Error('Fel email eller lösenord')

    const data = await res.json()
    auth.setUser(data.user)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div>
    <h1>Logga in</h1>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Lösenord" type="password" required />
      <button type="submit">LOGGA IN</button>
    </form>

    <!-- Knapp till register -->
    <router-link to="/registera-konto">
      <button>
        REGISTRERA DIG
      </button>
    </router-link>

    <p v-if="error">{{ error }}</p>
  </div>
</template>