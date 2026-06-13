import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser as apiLogin } from '../api/authService'
import { getUserProfile } from '../api/userService'

const AuthContext = createContext()

function loadUser() {
  try {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }, [token])

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  useEffect(() => {
    if (token && !user) {
      getUserProfile()
        .then(data => {
          if (data?.success) {
            setUser(data.user || data.profile)
          } else {
            setToken(null)
          }
        })
        .catch(() => setToken(null))
    }
  }, [])

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      if (data?.success) {
        setUser(data.user || { email })
        setToken(data.token)
        return true
      }
      throw new Error(data?.message || "Login failed")
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const isLoggedIn = () => {
    return !!token && !!user
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

  const completeAuth = (userData, authToken) => {
    setUser(userData)
    if (authToken) setToken(authToken)
    setIsAuthModalOpen(false)
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn,
      login,
      logout,
      updateUser,
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
