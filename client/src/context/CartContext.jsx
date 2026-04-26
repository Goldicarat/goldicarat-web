import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product, quantity = 1, selectedMetal = '', selectedSize = '') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && 
               item.selectedMetal === selectedMetal && 
               item.selectedSize === selectedSize
      )

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && 
          item.selectedMetal === selectedMetal && 
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, {
        ...product,
        quantity,
        selectedMetal: selectedMetal || product.metal,
        selectedSize: selectedSize || 'M'
      }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId, selectedMetal = '', selectedSize = '') => {
    setCartItems(prevItems => prevItems.filter(
      item => !(item.id === productId && 
               item.selectedMetal === selectedMetal && 
               item.selectedSize === selectedSize)
    ))
  }

  const updateQuantity = (productId, quantity, selectedMetal = '', selectedSize = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedMetal, selectedSize)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && 
        item.selectedMetal === selectedMetal && 
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  )

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  )

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
