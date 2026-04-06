import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload
            const existingItem = state.items.find(item => item.id === product.id)

            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    quantity: 1,
                })
            }
        },
        increaseQuantity: (state, action) => {
            const itemId = action.payload
            const item = state.items.find(product => product.id === itemId)

            if (item) {
                item.quantity += 1
            }
        },
        decreaseQuantity: (state, action) => {
            const itemId = action.payload
            const item = state.items.find(product => product.id === itemId)

            if (!item) return

            if (item.quantity > 1) {
                item.quantity -= 1
            } else {
                state.items = state.items.filter(product => product.id !== itemId)
            }
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload
            state.items = state.items.filter(item => item.id !== itemId)
        },
    },
})

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions
export default cartSlice.reducer
