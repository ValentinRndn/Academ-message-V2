// Store global d'authentification partagé entre tous les composants
import { ref, computed } from 'vue';
import { useToast } from './useToast';

// État global partagé
const user = ref(null);
const isAuthenticated = ref(false);
const loading = ref(false);
const error = ref(null);

// État de la session
const isSessionExpiring = ref(false);
const sessionTimeLeft = ref(0);
const showSessionAlert = ref(false);

// Variables pour la vérification de session
let sessionCheckInterval = null;

export const useAuthStore = () => {
  // Récupérer les informations de l'utilisateur
  const initAuth = async () => {
    if (loading.value) return isAuthenticated.value; // Éviter les appels multiples
    
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await useFetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (data.value && data.value.isAuthenticated) {
        user.value = data.value.user;
        isAuthenticated.value = true;
        console.log('✅ Utilisateur authentifié:', user.value);
        return true;
      } else {
        // Non authentifié, réinitialiser l'état
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
        body: { email, password },
        credentials: 'include'
      });
      
      if (data && data.user) {
        // Stocker les informations utilisateur
        user.value = data.user;
        isAuthenticated.value = true;
        
        console.log('✅ Connexion réussie, utilisateur:', user.value);
        
        // Notification de succès
        if (process.client) {
          // Petit délai pour s'assurer que le ToastContainer est monté
          setTimeout(() => {
            const { showSuccess } = useToast();
            showSuccess(
              'Connexion réussie !', 
              `Bienvenue ${data.user.firstName} ${data.user.lastName}`,
              5000
            );
          }, 100);
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
        body: userData,
        credentials: 'include'
      });
      
      if (data) {
        // Cas spécial : professeur en attente d'approbation
        if (data.pendingApproval) {
          console.log('✅ Inscription reçue, en attente d\'approbation:', data.user);
          
          // Ne pas connecter l'utilisateur, juste afficher une notification
          if (process.client) {
            setTimeout(() => {
              const { showInfo } = useToast();
              showInfo(
                'Inscription reçue !', 
                data.message || 'Votre demande est en cours de vérification.',
                8000
              );
            }, 100);
          }
          
          // Retourner un statut spécial pour déclencher la redirection
          return 'pending_approval';
        }
        
        // Inscription normale (étudiants ou autres rôles)
        if (data.user) {
          // Stocker les informations utilisateur
          user.value = data.user;
          isAuthenticated.value = true;
          
          console.log('✅ Inscription réussie, utilisateur:', user.value);
          
          // Notification de succès
          if (process.client) {
            setTimeout(() => {
              const { showSuccess } = useToast();
              showSuccess(
                'Compte créé avec succès !', 
                `Bienvenue ${data.user.firstName} ${data.user.lastName}`,
                5000
              );
            }, 100);
          }
          
          // Démarrer la vérification de session
          startSessionCheck();
          
          return true;
        }
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
      // Appeler l'API de déconnexion pour supprimer le cookie côté serveur
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Arrêter la vérification de session
      stopSessionCheck();

      // Nettoyer l'état local
      user.value = null;
      isAuthenticated.value = false;
      isSessionExpiring.value = false;
      showSessionAlert.value = false;
      
      console.log('✅ Déconnexion effectuée');
    }
  };

  // Vérifier l'état de la session
  const checkSessionStatus = async () => {
    try {
      const data = await $fetch('/api/auth/check-token', {
        credentials: 'include'
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

        // Émettre un événement pour afficher l'alerte d'expiration
        const event = new CustomEvent('session-expiring', {
          detail: {
            timeLeft: data.timeLeft,
            expiresAt: data.expiresAt
          }
        });
        window.dispatchEvent(event);
      }

    } catch (err) {
      console.error('Erreur lors de la vérification de session:', err);
    }
  };

  // Afficher l'alerte de session expirée
  const showSessionExpiredAlert = () => {
    showSessionAlert.value = true;
    
    // Émettre un événement pour les composants qui écoutent
    const event = new CustomEvent('session-expired');
    window.dispatchEvent(event);
  };

  // Démarrer la vérification périodique de session
  const startSessionCheck = () => {
    // Attendre 30 secondes avant la première vérification pour éviter les problèmes de timing
    setTimeout(checkSessionStatus, 30000);
    
    // Puis vérifier toutes les 5 minutes
    sessionCheckInterval = setInterval(checkSessionStatus, 5 * 60 * 1000);
  };

  // Arrêter la vérification de session
  const stopSessionCheck = () => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  };

  // Prolonger la session
  const extendSession = async () => {
    try {
      // Faire un appel à une route protégée pour prolonger automatiquement la session
      await $fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      // Réinitialiser l'état d'expiration
      isSessionExpiring.value = false;
      showSessionAlert.value = false;
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la prolongation de session:', err);
      return false;
    }
  };

  return {
    // État (reactive)
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isSessionExpiring: computed(() => isSessionExpiring.value),
    sessionTimeLeft: computed(() => sessionTimeLeft.value),
    showSessionAlert: computed(() => showSessionAlert.value),

    // Actions
    initAuth,
    login,
    register,
    logout,
    checkSessionStatus,
    showSessionExpiredAlert,
    startSessionCheck,
    stopSessionCheck,
    extendSession
  };
};
