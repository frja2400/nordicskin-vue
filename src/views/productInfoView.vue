<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const product = ref(null);
const loading = ref(true);
const error = ref('');

// Hämta produkt med id från route-parametern
const fetchProduct = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/products/${route.params.id}`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Kunde inte hämta produkten');

    const data = await res.json();
    product.value = data.product;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Navigera till editProductView
const goToEdit = () => {
  router.push(`/produkter/${route.params.id}/redigera`);
};

// Tillbaka till produktlistan
const goBack = () => {
  router.push('/produktlista');
};

onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="product-info">
    <h1>PRODUKTER</h1>
    <h2>Produktöversikt</h2>

    <div v-if="loading">
      <p>Laddar produkt...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="product" class="product-card">
      <img :src="product.imageUrl" alt="Produktbild" />
      <h2><strong>Namn:</strong> {{ product.name }}</h2>
      <p><strong>Pris:</strong> {{ product.price }} kr</p>
      <p><strong>Beskrivning:</strong> {{ product.description }}</p>
      <p><strong>Kategori:</strong> {{ product.category }}</p>
      <p><strong>Lagersaldo:</strong> {{ product.stock }}</p>

      <div class="buttons">
        <button @click="goToEdit">REDIGERA</button>
        <button @click="goBack">TILLBAKA</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-info {
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.product-card img {
  max-width: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-card h2 {
  margin: 10px 0;
}

.product-card p {
  margin: 5px 0;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.buttons button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>