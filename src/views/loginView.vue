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
  error.value = ''

  if (!email.value.trim()) {
    error.value = 'E-post måste fyllas i'
    return
  }

  if (!password.value.trim()) {
    error.value = 'Lösenord måste fyllas i'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Lösenordet måste vara minst 8 tecken'
    return
  }

  try {
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (!res.ok) {
      throw new Error('Fel e-post eller lösenord')
    }

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
    <h1>NØRDIC SKIN</h1>
    <form @submit.prevent="login">
      <input v-model="email" @input="error = ''" placeholder="Email" type="email" />
      <input v-model="password" @input="error = ''" placeholder="Lösenord" type="password" /><br>
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