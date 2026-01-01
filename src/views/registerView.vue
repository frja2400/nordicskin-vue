<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const department = ref('')
const password = ref('')
const error = ref('')

const register = async () => {
  try {
    // Registrera användaren
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        department: department.value,
        password: password.value
      }),
      credentials: 'include'
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Registreringen misslyckades')
    }

    // Logga in automatiskt
    const loginRes = await fetch('https://nordicskin-restapi.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
      credentials: 'include'
    })

    if (!loginRes.ok) {
      const data = await loginRes.json()
      throw new Error(data.message || 'Automatisk inloggning misslyckades')
    }

    const userData = await loginRes.json()
    auth.setUser(userData.user) 

    // Skicka till dashboard
    router.push('/dashboard')

  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div>
    <h1>Registrera konto</h1>
    <form @submit.prevent="register">
      <input v-model="name" placeholder="Namn:" required />
      <input v-model="email" placeholder="E-postadress:" type="email" required />
      <input v-model="phone" placeholder="Telefonnummer:" required />
      <input v-model="department" placeholder="Avdelning:" required />
      <input v-model="password" placeholder="Lösenord:" type="password" required />
      <button type="submit">SKAPA KONTO</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>