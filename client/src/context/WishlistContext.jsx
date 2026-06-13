import { createContext, useContext, useState } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const getProductId = (product) => product._id || product.id

  const addToWishlist = (product) => {
    const pid = getProductId(product)
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => getProductId(item) === pid)
      if (exists) return prevItems
      return [...prevItems, { ...product, id: pid }]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => getProductId(item) !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => getProductId(item) === productId)
  }

  const toggleWishlist = (product) => {
    const pid = getProductId(product)
    if (isInWishlist(pid)) {
      removeFromWishlist(pid)
    } else {
      addToWishlist(product)
    }
  }

  const clearWishlist = () => setWishlistItems([])

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      isWishlistOpen,
      setIsWishlistOpen,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
