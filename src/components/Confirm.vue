<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
let resolvePromise = null

const open = (msg) => {
    message.value = msg
    isOpen.value = true
    return new Promise((resolve) => {
        resolvePromise = resolve
    })
}

const confirm = () => {
    isOpen.value = false
    resolvePromise(true)
}

const cancel = () => {
    isOpen.value = false
    resolvePromise(false)
}

defineExpose({ open })
</script>

<template>
    <div v-if="isOpen" class="overlay" @click.self="cancel">
        <div class="dialog">
            <p>{{ message }}</p>
            <div class="buttons">
                <button @click="cancel" class="cancel">AVBRYT</button>
                <button @click="confirm" class="delete">RADERA</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dialog {
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}

.dialog p {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #333;
}

.buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

button {
    padding: 10px 20px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.cancel {
    background: #888;
    color: white;
}

.cancel:hover {
    background: #555;
}

.delete {
    background: #dc2626;
    color: white;
}

.delete:hover {
    background: #b91c1c;
}
</style>