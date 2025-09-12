// Wrapper pour maintenir la compatibilité avec l'ancien useAuth
// Utilise maintenant le store global useAuthStore
import { useAuthStore } from './useAuthStore';

export const useAuth = () => {
  // Utiliser le store global au lieu de créer un nouvel état local
  return useAuthStore();
};