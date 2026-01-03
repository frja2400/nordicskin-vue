<script setup>
import ProductForm from '@/components/ProductForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const product = ref({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  category: '',
  imageUrl: ''
})

const createProduct = async () => {
  const res = await fetch('https://nordicskin-restapi.onrender.com/api/products', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product.value)
  })

  if (res.ok) {
    router.push('/produktlista')
  }
}
</script>

<template>
  <h1>PRODUKTER</h1>
  <h2>Lägg till produkt</h2>
  <ProductForm :product="product" submitText="LÄGG TILL" @submit="createProduct" />

  <!-- Avbryt-knapp -->
  <button @click="router.push('/produktlista')" class="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
    AVBRYT
  </button>
</template>