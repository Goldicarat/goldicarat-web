import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const login = (email, password) => {
    setUser({ email, name: email.split('@')[0] })
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const isLoggedIn = () => {
    return user !== null
  }

  const requireAuth = (action) => {
    if (isLoggedIn()) {
      action()
    } else {
      setPendingAction(() => action)
      setIsAuthModalOpen(true)
    }
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setPendingAction(null)
  }

  const completeAuth = (userData) => {
    setUser(userData)
    setIsAuthModalOpen(false)
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      requireAuth,
      isAuthModalOpen,
      setIsAuthModalOpen,
      closeAuthModal,
      completeAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
