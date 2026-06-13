import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { isLoggedIn, setIsAuthModalOpen } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/')
    } else {
      setIsAuthModalOpen(true)
      navigate(-1)
    }
  }, [])

  return null
}
