<template>
  <div class="app">
    <header class="header">
      <h1>🎵 {{ t('header.title') }}</h1>
      <p>{{ t('header.subtitle') }}</p>
      <div class="header-controls">
        <div class="lang-selector">
          <select v-model="locale" aria-label="Select language">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <button class="cart-btn" @click="cartOpen = true" :aria-label="t('cart.title')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <CartDrawer :is-open="cartOpen" @close="cartOpen = false" />

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>{{ t('loading') }}</p>
      </div>

      <div v-else-if="hasError" class="error">
        <p>{{ t('error.message') }}</p>
        <button @click="fetchAlbums" class="retry-btn">{{ t('error.retry') }}</button>
      </div>

      <div v-else class="albums-grid">
        <AlbumCard 
          v-for="album in albums" 
          :key="album.id" 
          :album="album" 
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import CartDrawer from './components/CartDrawer.vue'
import type { Album } from './types/album'
import { useCart } from './composables/useCart'

const { t, locale } = useI18n()
const { cartCount } = useCart()

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const hasError = ref<boolean>(false)
const cartOpen = ref<boolean>(false)

const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    hasError.value = false
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    hasError.value = true
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAlbums()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.25rem;
}

.lang-selector {
  margin-top: 0;
}

.lang-selector select {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 2rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='white' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  transition: background 0.2s, border-color 0.2s;
}

.lang-selector select:hover {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: white;
}

.lang-selector select option {
  background: #667eea;
  color: white;
}

.cart-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  color: white;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: white;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e53e3e;
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: white;
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: white;
  color: #667eea;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
