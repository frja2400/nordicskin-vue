<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, onMounted } from 'vue'
import Confirm from '@/components/Confirm.vue'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const errors = ref({})
const confirmDialog = ref(null)

// Formulärdata
const formData = ref({
  name: '',
  email: '',
  phone: '',
  department: ''
})

const userId = ref(null)

const clearError = (field) => {
  errors.value[field] = ''
}

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
    // Om det inte går att hämta användaren, visa fel under email
    errors.value.email = 'Kunde inte hämta användaruppgifter'
  } finally {
    loading.value = false
  }
}

// Spara ändringar
const saveChanges = async () => {
  if (!userId.value) return

  errors.value = {}

  // Frontend-validering
  if (!formData.value.name.trim()) {
    errors.value.name = 'Namn måste fyllas i'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'E-post måste fyllas i'
  }

  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Telefonnummer måste fyllas i'
  }

  if (!formData.value.department.trim()) {
    errors.value.department = 'Avdelning måste fyllas i'
  }

  // Om det finns valideringsfel, avbryt
  if (Object.keys(errors.value).length > 0) {
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

    if (!res.ok) {
      // Backend-validering: e-posten finns redan
      errors.value.email = 'E-postadressen finns redan'
      return
    }

    // Gå tillbaka till profilen
    router.push('/profil')

  } catch (err) {
    errors.value.email = 'E-postadressen finns redan'
  } finally {
    saving.value = false
  }
}

// Radera konto
const deleteAccount = async () => {
  if (!userId.value) return

  // Bekräfta att användaren verkligen vill radera
  const confirmed = await confirmDialog.value.open(
    'Är du säker på att du vill radera ditt konto? Detta går inte att ångra.'
  )

  if (!confirmed) return

  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/users/${userId.value}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!res.ok) {
      errors.value.email = 'Kunde inte radera konto'
      return
    }

    // Logga ut och gå till inloggningssidan
    await fetch('https://nordicskin-restapi.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include'
    })

    auth.logout()
    router.push('/logga-in')

  } catch (err) {
    errors.value.email = 'Kunde inte radera konto'
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
  <div class="edit-profile-container">
    <h1>PROFIL</h1>

    <div v-if="loading">
      <p>Laddar...</p>
    </div>

    <!-- Formulär -->
    <form @submit.prevent="saveChanges" v-if="!loading">
      <div class="form-group">
        <label for="name">Namn:</label>
        <input type="text" id="name" v-model="formData.name" @input="clearError('name')" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="form-group">
        <label for="email">E-post:</label>
        <input type="email" id="email" v-model="formData.email" @input="clearError('email')" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="phone">Telefon:</label>
        <input type="tel" id="phone" v-model="formData.phone" @input="clearError('phone')" />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </div>

      <div class="form-group">
        <label for="department">Avdelning:</label>
        <input type="text" id="department" v-model="formData.department" @input="clearError('department')" />
        <p v-if="errors.department" class="error">{{ errors.department }}</p>
      </div>

      <div class="buttons">
        <button type="submit" :disabled="saving">
          {{ saving ? 'SPARAR...' : 'SPARA' }}
        </button>
        <button type="button" @click="cancel" class="cancel-btn">
          AVBRYT
        </button>
        <button type="button" @click="deleteAccount" class="delete-btn">
          RADERA KONTO
        </button>
      </div>
    </form>
    <Confirm ref="confirmDialog" />
  </div>
</template>

<style scoped>
.edit-profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
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

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #222;
  color: white;
}

button:hover {
  background-color: #000;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #888;
}

.cancel-btn:hover {
  background-color: #555;
}

.delete-btn {
  background-color: #dc2626;
}

.delete-btn:hover {
  background-color: #b91c1c;
}
</style>