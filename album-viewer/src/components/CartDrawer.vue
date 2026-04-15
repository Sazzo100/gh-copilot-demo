<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cart-overlay" @click.self="$emit('close')">
      <div class="cart-drawer">
        <div class="cart-header">
          <h2>🛒 {{ t('cart.title') }}</h2>
          <button class="close-btn" @click="$emit('close')" aria-label="Close cart">✕</button>
        </div>

        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>{{ t('cart.empty') }}</p>
        </div>

        <ul v-else class="cart-items">
          <li v-for="item in cartItems" :key="item.album.id" class="cart-item">
            <img
              :src="item.album.image_url"
              :alt="item.album.title"
              class="cart-item-image"
              @error="handleImageError"
            />
            <div class="cart-item-info">
              <p class="cart-item-title">{{ item.album.title }}</p>
              <p class="cart-item-artist">{{ item.album.artist.name }}</p>
              <p class="cart-item-price">${{ (item.album.price * item.quantity).toFixed(2) }}</p>
              <p v-if="item.quantity > 1" class="cart-item-qty">× {{ item.quantity }}</p>
            </div>
            <button class="remove-btn" @click="removeFromCart(item.album.id)">
              {{ t('cart.remove') }}
            </button>
          </li>
        </ul>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <span class="cart-total-label">{{ t('cart.total') }}</span>
          <span class="cart-total-value">${{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCart } from '../composables/useCart'

defineProps<{ isOpen: boolean }>()
defineEmits<{ close: [] }>()

const { t } = useI18n()
const { cartItems, cartTotal, removeFromCart } = useCart()

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/60x60/667eea/white?text=🎵'
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.cart-drawer {
  background: white;
  width: 380px;
  max-width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  animation: slide-in 0.25s ease;
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.cart-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1rem;
  padding: 2rem;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item-image {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-artist {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.2rem;
}

.cart-item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.cart-item-qty {
  font-size: 0.8rem;
  color: #999;
  margin: 0.1rem 0 0;
}

.remove-btn {
  background: transparent;
  border: 1px solid #e53e3e;
  color: #e53e3e;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #e53e3e;
  color: white;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
}

.cart-total-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.cart-total-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #667eea;
}
</style>
