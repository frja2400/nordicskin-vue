<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/solid'

const router = useRouter();
const products = ref([]);
const loading = ref(true);
const error = ref('');

// Hämta produkter från backend
const fetchProducts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('https://nordicskin-restapi.onrender.com/api/products', {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Kunde inte hämta produkter');

    const data = await res.json();
    products.value = data.products;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Navigera till produkt-översikt
const goToProduct = (id) => {
  router.push(`/produkter/${id}`);
};

// Navigera till lägg till produkt-sida
const goToAddProduct = () => {
  router.push('/skapa-produkt')
};

// Ändra lagersaldo direkt
const changeStock = async (id, amount) => {
  try {
    const res = await fetch(`https://nordicskin-restapi.onrender.com/api/products/${id}/stock`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    if (!res.ok) throw new Error('Kunde inte ändra lagersaldo');

    // Uppdatera lagersaldo lokalt direkt
    const product = products.value.find(p => p._id === id);
    if (product) product.stock += amount;

  } catch (err) {
    console.error(err.message);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="product-list">
    <h1>PRODUKTER</h1>

    <button aria-label="Lägg till produkt" @click="goToAddProduct">
      <PlusIcon class="w-6 h-6 text-black" />
    </button>

    <div v-if="loading">
      <p>Laddar produkter...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div class="products-grid" v-if="!loading && !error">
      <div v-for="product in products" :key="product._id" class="product-card" @click="goToProduct(product._id)">
        <img :src="product.imageUrl" alt="product image" />
        <h2>{{ product.name }}</h2>
        <p>Pris: {{ product.price }} kr</p>
        <div class="stock-control" @click.stop>
          <button @click="changeStock(product._id, -1)">-</button>
          <span>Lagersaldo: {{ product.stock }}</span>
          <button @click="changeStock(product._id, 1)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.product-card img {
  max-width: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.stock-control {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.stock-control button {
  padding: 5px 10px;
  font-size: 16px;
}
</style>