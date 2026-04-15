import { ref, computed } from 'vue'
import type { Album } from '../types/album'

export interface CartItem {
    album: Album
    quantity: number
}

// Module-level state so the cart is shared across all components
const cartItems = ref<CartItem[]>([])

export function useCart() {
    const cartCount = computed(() =>
        cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    const cartTotal = computed(() => {
        const total = cartItems.value.reduce(
            (sum, item) => sum + item.album.price * item.quantity,
            0
        )

        return Math.round(total * 100) / 100
    })
    function addToCart(album: Album): void {
        const existing = cartItems.value.find(item => item.album.id === album.id)
        if (existing) {
            existing.quantity++
        } else {
            cartItems.value.push({ album, quantity: 1 })
        }
    }

    function removeFromCart(albumId: number): void {
        cartItems.value = cartItems.value.filter(item => item.album.id !== albumId)
    }

    function clearCart(): void {
        cartItems.value = []
    }

    return { cartItems, cartCount, cartTotal, addToCart, removeFromCart, clearCart }
}
