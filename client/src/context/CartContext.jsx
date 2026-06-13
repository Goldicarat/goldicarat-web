import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'goldicarat_cart'

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const getProductId = (product) => product._id || product.id

  const addToCart = (product, quantity = 1, selectedMetal = '', selectedSize = '', selectedKarat = '') => {
    const pid = getProductId(product)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => getProductId(item) === pid && 
               item.selectedMetal === selectedMetal && 
               item.selectedSize === selectedSize &&
               item.selectedKarat === selectedKarat
      )

      if (existingItem) {
        return prevItems.map(item =>
          getProductId(item) === pid && 
          item.selectedMetal === selectedMetal && 
          item.selectedSize === selectedSize &&
          item.selectedKarat === selectedKarat
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, {
        ...product,
        id: pid,
        quantity,
        selectedMetal: selectedMetal || product.metal,
        selectedSize: selectedSize || 'M',
        selectedKarat: selectedKarat || product.goldKarat || '',
      }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId, selectedMetal = '', selectedSize = '', selectedKarat = '') => {
    setCartItems(prevItems => prevItems.filter(
      item => !(getProductId(item) === productId && 
               item.selectedMetal === selectedMetal && 
               item.selectedSize === selectedSize &&
               item.selectedKarat === selectedKarat)
    ))
  }

  const updateQuantity = (productId, quantity, selectedMetal = '', selectedSize = '', selectedKarat = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedMetal, selectedSize, selectedKarat)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        getProductId(item) === productId && 
        item.selectedMetal === selectedMetal && 
        item.selectedSize === selectedSize &&
        item.selectedKarat === selectedKarat
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
