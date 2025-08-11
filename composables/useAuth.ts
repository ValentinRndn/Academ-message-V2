import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'student' | 'teacher'
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  // Charger l'utilisateur au démarrage
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        isAuthenticated.value = false
        user.value = null
        return
      }
      
      try {
        // Décoder le token JWT (sans vérification côté client)
        const base64Url = token.split('.')[1]
        if (!base64Url) {
          throw new Error('Token malformé')
        }
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        
        const decoded = JSON.parse(jsonPayload)
        
        // Vérifier si le token a expiré
        if (decoded.exp && typeof decoded.exp === 'number') {
          const expirationDate = new Date(decoded.exp * 1000)
          if (expirationDate < new Date()) {
            console.warn('Token expiré, déconnexion')
            localStorage.removeItem('token')
            isAuthenticated.value = false
            user.value = null
            return
          }
        }
        
        // Définir l'utilisateur
        user.value = {
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role
        }
        isAuthenticated.value = true
      } catch (err) {
        console.error('Erreur de décodage du token:', err)
        localStorage.removeItem('token')
        isAuthenticated.value = false
        user.value = null
      }
    } catch (err: any) {
      console.error('Error loading user:', err)
      localStorage.removeItem('token')
      isAuthenticated.value = false
      user.value = null
    }
  }

  // Connexion
  const login = async (payload: LoginPayload) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion')
      }
      
      // Stocker le token
      if (data.token) {
        localStorage.setItem('token', data.token)
        
        // Charger les données utilisateur
        await loadUser()
        
        // Rediriger selon le rôle
        if (user.value?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        throw new Error('Token non reçu du serveur')
      }
      
      return data
      
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Inscription
  const register = async (payload: RegisterPayload) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription')
      }
      
      // Stocker le token
      if (data.token) {
        localStorage.setItem('token', data.token)
        
        // Charger les données utilisateur
        await loadUser()
        
        // Rediriger vers la page d'accueil
        router.push('/')
      } else {
        throw new Error('Token non reçu du serveur')
      }
      
      return data
      
    } catch (err: any) {
      console.error('Register error:', err)
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    user.value = null
    router.push('/login')
  }

  // Initialiser au démarrage
  loadUser()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser
  }
}