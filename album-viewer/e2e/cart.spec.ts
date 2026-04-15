import { test, expect } from '@playwright/test'

test('add album to cart and verify', async ({ page }) => {
    // Step 1: Open the Album App
    await page.goto('/')
    await expect(page).toHaveTitle(/Album/)

    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })

    // Step 2: Click "Add to Cart" on the first tile
    const firstCard = page.locator('.album-card').first()
    const albumTitle = await firstCard.locator('.album-title').textContent()
    await firstCard.locator('button.btn-primary').click()

    // Confirm button changes to "In Cart"
    await expect(firstCard.locator('button.btn-primary')).toHaveText('In Cart')

    // Step 3: Click the cart button on the top right
    await page.locator('button.cart-btn').click()

    // Wait for the cart drawer to open
    await page.waitForSelector('.cart-drawer', { timeout: 5000 })

    // Step 4: Check that the cart contains the added album
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    await expect(cartItems.first().locator('.cart-item-title')).toHaveText(albumTitle!)

    // Step 5: Take a screenshot of the cart
    await page.screenshot({ path: 'e2e/screenshots/cart.png', fullPage: false })
})
