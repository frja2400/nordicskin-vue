<script setup>
import { ref } from 'vue'

// Props från parent
const { product, submitText } = defineProps({
    product: Object,
    submitText: String
})

const emit = defineEmits(['submit'])

// Lokala felmeddelanden
const errors = ref({})

// Funktion som kollar att strängen är en "giltig URL" (lokal eller extern)
const isValidUrl = (url) => {
    return /^(https?:\/\/|\/)/.test(url)
}

// Hantera submit
const handleSubmit = () => {
    errors.value = {}

    // Validering
    if (!product.name.trim()) errors.value.name = 'Namn måste fyllas i'
    if (!product.description.trim()) errors.value.description = 'Beskrivning måste fyllas i'
    if (!product.category.trim()) errors.value.category = 'Kategori måste väljas'

    if (!product.imageUrl.trim()) {
        errors.value.imageUrl = 'Bild-URL måste fyllas i'
    } else if (!isValidUrl(product.imageUrl.trim())) {
        errors.value.imageUrl = 'Bild-URL måste vara en giltig.'
    }

    const price = Number(product.price)
    const stock = Number(product.stock)

    if (isNaN(price) || price <= 0) {
        errors.value.price = 'Pris måste vara större än 0'
    }

    if (isNaN(stock) || stock < 0) {
        errors.value.stock = 'Lagersaldo måste vara 0 eller högre'
    }

    // Om inga fel, emit submit
    if (Object.keys(errors.value).length === 0) {
        emit('submit')
    }
}

// Funktion för att rensa fel när användaren skriver
const clearError = (field) => {
    errors.value[field] = ''
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="product-form">
        <div>
            <label>
                Bild-URL
                <input v-model="product.imageUrl" placeholder="Bild-URL" @input="clearError('imageUrl')" />
            </label>
            <p v-if="errors.imageUrl" class="error">{{ errors.imageUrl }}</p>
        </div>

        <div>
            <label>
                Namn
                <input v-model="product.name" placeholder="Namn" @input="clearError('name')" />
            </label>
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <div>
            <label>
                Pris
                <input v-model="product.price" type="number" step="0.01" min="0" @input="clearError('price')" />
            </label>
            <p v-if="errors.price" class="error">{{ errors.price }}</p>
        </div>

        <div>
            <label>
                Kategori
                <select v-model="product.category" @change="clearError('category')">
                    <option disabled value="">Välj kategori</option>
                    <option value="hudvård">Hudvård</option>
                    <option value="makeup">Makeup</option>
                    <option value="verktyg">Verktyg</option>
                </select>
            </label>
            <p v-if="errors.category" class="error">{{ errors.category }}</p>
        </div>

        <div>
            <label>
                Beskrivning
                <textarea v-model="product.description" @input="clearError('description')"></textarea>
            </label>
            <p v-if="errors.description" class="error">{{ errors.description }}</p>
        </div>

        <div>
            <label>
                Lagersaldo
                <input v-model="product.stock" type="number" min="0" @input="clearError('stock')" />
            </label>
            <p v-if="errors.stock" class="error">{{ errors.stock }}</p>
        </div>

        <button type="submit" class="submit-btn">{{ submitText }}</button>
    </form>
</template>

<style scoped>
.product-form {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    font-size: 14px;
}

input,
textarea,
select {
    margin-top: 6px;
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #555;
}

.error {
    color: red;
    font-size: 13px;
    margin-top: 4px;
}

.submit-btn {
    margin-top: 10px;
    padding: 10px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: #222;
    color: white;
}

.submit-btn:hover {
    background-color: #000;
}
</style>