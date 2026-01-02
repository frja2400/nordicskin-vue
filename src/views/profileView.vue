<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, onMounted } from 'vue'

const router = useRouter()
const auth = useAuthStore()

const user = ref(null)
const loading = ref(true)
const error = ref('')

// Hämta användaruppgifter
const fetchUser = async () => {
  try {
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/me', {
      credentials: 'include'
    })

    if (!res.ok) throw new Error('Kunde inte hämta användaruppgifter')

    const data = await res.json()
    user.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Logga ut användaren
const logout = async () => {
  await fetch('https://nordicskin-restapi.onrender.com/api/logout', {
    method: 'POST',
    credentials: 'include'
  })

  auth.logout()
  router.push('/logga-in')
}

const goToEdit = () => {
  router.push('/redigera-profil')
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div>
    <h1>PROFIL</h1>

    <div v-if="loading">
      <p>Laddar...</p>
    </div>

    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="user">
      <div class="user-info">
        <p><strong>Namn:</strong> {{ user.name }}</p>
        <p><strong>E-post:</strong> {{ user.email }}</p>
        <p><strong>Telefon:</strong> {{ user.phone }}</p>
        <p><strong>Avdelning:</strong> {{ user.department }}</p>
      </div>

      <div class="buttons">
        <button @click="goToEdit">REDIGERA</button><br>
        <button @click="logout">LOGGA UT</button>
      </div>
    </div>
  </div>
</template>