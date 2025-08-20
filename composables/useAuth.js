// Composable pour la gestion de l'authentification
import { ref } from 'vue';

export const useAuth = () => {
  // État de l'authentification
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  
  // État de la session
  const isSessionExpiring = ref(false);
  const sessionTimeLeft = ref(0);
  const showSessionAlert = ref(false);

  // Récupérer les informations de l'utilisateur depuis le token stocké
  const initAuth = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Récupérer le token du localStorage
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        isAuthenticated.value = false;
        return false;
      }
      
      token.value = storedToken;
      
      // Vérifier la validité du token
      const { data } = await useFetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      
      if (data.value && data.value.isAuthenticated) {
        user.value = data.value.user;
        isAuthenticated.value = true;
        return true;
      } else {
        // Token invalide, déconnecter l'utilisateur
        logout();
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
      error.value = 'Erreur lors de la récupération des informations utilisateur';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Connexion
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      if (data && data.token) {
        // Stocker le token et les informations utilisateur
        token.value = data.token;
        user.value = data.user;
        isAuthenticated.value = true;
        
        // Sauvegarder le token dans le localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Notification de succès
        if (process.client) {
          const { showSuccess } = useNotifications();
          showSuccess(
            'Connexion réussie !', 
            `Bienvenue ${data.user.firstName} ${data.user.lastName}`,
            3000
          );
        }
        
        // Démarrer la vérification de session
        startSessionCheck();
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      error.value = err.data?.message || 'Erreur lors de la connexion';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Inscription
  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      });
      
      if (data && data.token) {
        // Stocker le token et les informations utilisateur
        token.value = data.token;
        user.value = data.user;
        isAuthenticated.value = true;
        
        // Sauvegarder le token dans le localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Démarrer la vérification de session
        startSessionCheck();
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      error.value = err.data?.message || 'Erreur lors de l\'inscription';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      // Appeler l'API de déconnexion
      await $fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Arrêter la vérification de session
      stopSessionCheck();
      
      // Nettoyer l'état local même en cas d'erreur
      token.value = null;
      user.value = null;
      isAuthenticated.value = false;
      isSessionExpiring.value = false;
      showSessionAlert.value = false;
      localStorage.removeItem('auth_token');
    }
  };

  // Vérifier l'état de la session
  const checkSessionStatus = async () => {
    if (!token.value) return;
    
    try {
      const data = await $fetch('/api/auth/check-token', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
      
      if (data.isExpired) {
        // Session expirée - déconnecter et alerter
        showSessionExpiredAlert();
        logout();
        return;
      }
      
      if (data.isExpiring) {
        isSessionExpiring.value = true;
        sessionTimeLeft.value = data.timeLeft;
        // Optionnel: Afficher une notification que la session expire bientôt
      }
      
    } catch (err) {
      console.error('Erreur lors de la vérification de session:', err);
    }
  };
  
  // Afficher l'alerte de session expirée
  const showSessionExpiredAlert = () => {
    showSessionAlert.value = true;
    error.value = 'Votre session a expiré. Veuillez vous reconnecter.';
  };
  
  // Fermer l'alerte et rediriger vers login
  const closeSessionAlert = () => {
    showSessionAlert.value = false;
    error.value = null;
    navigateTo('/login');
  };
  
  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user.value && user.value.role === role;
  };
  
  // Timer pour vérifier périodiquement la session
  let sessionCheckInterval = null;
  
  // Démarrer la vérification périodique de session
  const startSessionCheck = () => {
    if (process.client && isAuthenticated.value) {
      // Vérifier toutes les 5 minutes
      sessionCheckInterval = setInterval(checkSessionStatus, 5 * 60 * 1000);
    }
  };
  
  // Arrêter la vérification de session
  const stopSessionCheck = () => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  };

  // Initialiser l'authentification au démarrage si le navigateur est disponible
  if (process.client) {
    initAuth().then(() => {
      if (isAuthenticated.value) {
        startSessionCheck();
      }
    });
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    initAuth,
    hasRole,
    // Gestion de session
    isSessionExpiring,
    sessionTimeLeft,
    showSessionAlert,
    closeSessionAlert,
    checkSessionStatus
  };
};
