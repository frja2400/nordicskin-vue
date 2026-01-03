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
const errors = ref({})

const clearError = (field) => {
  errors.value[field] = ''
}

const register = async () => {
  errors.value = {}

  // Frontend-validering
  if (!name.value.trim()) {
    errors.value.name = 'Namn måste fyllas i'
  }

  if (!email.value.trim()) {
    errors.value.email = 'E-post måste fyllas i'
  }

  if (!phone.value.trim()) {
    errors.value.phone = 'Telefonnummer måste fyllas i'
  }

  if (!department.value.trim()) {
    errors.value.department = 'Avdelning måste fyllas i'
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
      // Backend-validering: e-posten finns redan
      errors.value.email = 'E-postadressen finns redan'
      return
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
      errors.value.password = 'Automatisk inloggning misslyckades'
      return
    }

    const userData = await loginRes.json()
    auth.setUser(userData.user)

    router.push('/dashboard')

  } catch (err) {
    errors.value.email = 'E-postadressen finns redan'
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Skapa adminkonto</h1>

    <form @submit.prevent="register">
      <div class="form-group">
        <input v-model="name" @input="clearError('name')" placeholder="Namn:" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="form-group">
        <input v-model="email" @input="clearError('email')" placeholder="E-postadress:" type="email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <input v-model="phone" @input="clearError('phone')" placeholder="Telefonnummer:" />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </div>

      <div class="form-group">
        <input v-model="department" @input="clearError('department')" placeholder="Avdelning:" />
        <p v-if="errors.department" class="error">{{ errors.department }}</p>
      </div>

      <div class="form-group">
        <input v-model="password" @input="clearError('password')" placeholder="Lösenord:" type="password" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit">SKAPA KONTO</button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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
</style>