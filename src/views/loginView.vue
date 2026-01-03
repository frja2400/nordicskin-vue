<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref({})

const clearError = (field) => {
  errors.value[field] = ''
}

const login = async () => {
  errors.value = {}

  // Validering
  if (!email.value.trim()) {
    errors.value.email = 'E-post måste fyllas i'
  }

  if (!password.value.trim()) {
    errors.value.password = 'Lösenord måste fyllas i'
  } else if (password.value.length < 8) {
    errors.value.password = 'Lösenordet måste vara minst 8 tecken'
  }

  // Om det finns valideringsfel, avbryt
  if (Object.keys(errors.value).length > 0) {
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
      errors.value.general = 'Fel e-post eller lösenord'
      return
    }

    const data = await res.json()
    auth.setUser(data.user)
    router.push('/dashboard')

  } catch (err) {
    errors.value.general = err.message
  }
}
</script>

<template>
  <div class="login-container">
    <h1>NØRDIC SKIN</h1>

    <p v-if="errors.general" class="error-general">{{ errors.general }}</p>

    <form @submit.prevent="login">
      <div class="form-group">
        <input v-model="email" @input="clearError('email')" placeholder="E-postadress" type="email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <input v-model="password" @input="clearError('password')" placeholder="Lösenord" type="password" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit">LOGGA IN</button>
    </form>

    <router-link to="/registera-konto">
      <button class="register-btn">
        REGISTRERA DIG
      </button>
    </router-link>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  outline: none;
  border-color: #555;
}

.error {
  color: red;
  font-size: 13px;
  margin-top: 4px;
}

.error-general {
  color: red;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 10px;
  background-color: #fee;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #222;
  color: white;
  margin-top: 10px;
}

button:hover {
  background-color: #000;
}

.register-btn {
  background-color: #555;
}

.register-btn:hover {
  background-color: #333;
}
</style>