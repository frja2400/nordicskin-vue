<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProductForm from '@/components/ProductForm.vue'
import Confirm from '@/components/Confirm.vue'

const router = useRouter()
const route = useRoute()

const product = ref({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  category: '',
  imageUrl: ''
})

const loading = ref(true)
const error = ref('')
const confirmDialog = ref(null)

// Hämta produkten med id från route-parametern och förifyll formuläret
const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/products/${route.params.id}`, {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Kunde inte hämta produkten')
    const data = await res.json()
    product.value = data.product
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Uppdatera produkten
const updateProduct = async () => {
  try {
    // Skapa payload _id
    const payload = {
      name: product.value.name,
      price: Number(product.value.price),
      stock: Number(product.value.stock),
      description: product.value.description,
      category: product.value.category,
      imageUrl: product.value.imageUrl
    }

    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/products/${route.params.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const data = await res.json()
      console.error('Fel från backend:', data)
      throw new Error(data.error || 'Kunde inte uppdatera produkten')
    }

    router.push(`/produkter/${route.params.id}`)
  } catch (err) {
    console.error('Complete error:', err)
    error.value = err.message
  }
}

// Radera produkten
const deleteProduct = async () => {
  const confirmed = await confirmDialog.value.open(
    `Är du säker på att du vill radera "${product.value.name}"?`
  )

  if (!confirmed) return

  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/products/${route.params.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Kunde inte radera produkten')
    }

    // Navigera tillbaka till produktlistan
    router.push('/produktlista')
  } catch (err) {
    console.error(err.message)
    error.value = err.message
  }
}


// Avbryt och gå tillbaka
const cancelEdit = () => {
  router.push(`/produkter/${route.params.id}`)
}

onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <div class="edit-product">
    <h1>PRODUKTER</h1>
    <h2>Redigera produkt</h2>

    <div v-if="loading">
      <p>Laddar produkt...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="!loading && !error">
      <ProductForm :product="product" submitText="SPARA" @submit="updateProduct" />

      <button class="cancel-btn" @click="cancelEdit">AVBRYT</button><br>
      <button class="delete-btn" @click="deleteProduct">RADERA</button>
    </div>
    <Confirm ref="confirmDialog" />
  </div>
</template>

<style scoped>
.edit-product {
  padding: 20px;
}

.cancel-btn,
.delete-btn {
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #888;
  color: white;
}
</style>