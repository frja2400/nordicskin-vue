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
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Namn måste fyllas i'
    return
  }

  if (!email.value.trim()) {
    error.value = 'E-post måste fyllas i'
    return
  }

  if (!phone.value.trim()) {
    error.value = 'Telefonnummer måste fyllas i'
    return
  }

  if (!department.value.trim()) {
    error.value = 'Avdelning måste fyllas i'
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
    // Registrera användaren
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        department: department.value,
        password: password.value
      })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Registreringen misslyckades')
    }

    // Logga in automatiskt
    const loginRes = await fetch('https://nordicskin-restapi.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (!loginRes.ok) {
      const data = await loginRes.json()
      throw new Error(data.message || 'Automatisk inloggning misslyckades')
    }

    const userData = await loginRes.json()
    auth.setUser(userData.user)

    router.push('/dashboard')

  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div>
    <h1>Skapa adminkonto</h1>
    <form @submit.prevent="register">
      <input v-model="name" @input="error = ''" placeholder="Namn:" />
      <input v-model="email" @input="error = ''" placeholder="E-postadress:" type="email" />
      <input v-model="phone" @input="error = ''" placeholder="Telefonnummer:" />
      <input v-model="department" @input="error = ''" placeholder="Avdelning:" />
      <input v-model="password" @input="error = ''" placeholder="Lösenord:" type="password" />
      <button type="submit">SKAPA KONTO</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>