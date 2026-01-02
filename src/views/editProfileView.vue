<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, onMounted } from 'vue'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

// Formulärdata
const formData = ref({
  name: '',
  email: '',
  phone: '',
  department: ''
})

const userId = ref(null)

// Hämta användaruppgifter och förifyll formuläret
const fetchUser = async () => {
  try {
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/me', {
      credentials: 'include'
    })

    if (!res.ok) throw new Error('Kunde inte hämta användaruppgifter')

    const data = await res.json()

    // Förifyll formuläret
    formData.value.name = data.name
    formData.value.email = data.email
    formData.value.phone = data.phone
    formData.value.department = data.department
    userId.value = data._id

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Spara ändringar
const saveChanges = async () => {
  if (!userId.value) return

  error.value = ''

  if (!formData.value.name.trim()) {
    error.value = 'Namn måste fyllas i'
    return
  }

  if (!formData.value.email.trim()) {
    error.value = 'E-post måste fyllas i'
    return
  }

  if (!formData.value.phone.trim()) {
    error.value = 'Telefonnummer måste fyllas i'
    return
  }

  if (!formData.value.department.trim()) {
    error.value = 'Avdelning måste fyllas i'
    return
  }

  saving.value = true

  try {
    // Bygg payload
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      department: formData.value.department
    }

    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/users/${userId.value}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Kunde inte uppdatera profil')

    // Gå tillbaka till profilen
    router.push('/profil')

  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

// Radera konto
const deleteAccount = async () => {
  if (!userId.value) return

  // Bekräfta att användaren verkligen vill radera
  if (!confirm('Är du säker på att du vill radera ditt konto? Detta går inte att ångra.')) {
    return
  }

  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/users/${userId.value}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!res.ok) throw new Error('Kunde inte radera konto')

    // Logga ut och gå till inloggningssidan
    await fetch('https://nordicskin-restapi.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include'
    })

    auth.logout()
    router.push('/logga-in')

  } catch (err) {
    error.value = err.message
  }
}

// Avbryt - gå tillbaka utan att spara
const cancel = () => {
  router.push('/profil')
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

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- Formulär -->
    <form @submit.prevent="saveChanges">
      <div class="form-group">
        <label for="name">Namn:</label>
        <input type="text" id="name" v-model="formData.name" />
      </div>

      <div class="form-group">
        <label for="email">E-post:</label>
        <input type="email" id="email" v-model="formData.email" />
      </div>

      <div class="form-group">
        <label for="phone">Telefon:</label>
        <input type="tel" id="phone" v-model="formData.phone" />
      </div>

      <div class="form-group">
        <label for="department">Avdelning:</label>
        <input type="text" id="department" v-model="formData.department" />
      </div>

      <div class="buttons">
        <button type="submit" :disabled="saving">
          {{ saving ? 'SPARAR...' : 'SPARA' }}
        </button><br>
        <button type="button" @click="cancel">
          AVBRYT
        </button><br>
        <button type="button" @click="deleteAccount" class="delete-btn">
          RADERA KONTO
        </button>
      </div>
    </form>
  </div>
</template>