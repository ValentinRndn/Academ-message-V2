// Utilitaire pour la gestion des JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'academ-secure-jwt-secret-2025';
const JWT_EXPIRES_IN = '7d'; // 7 jours
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 jour en millisecondes
const ALERT_THRESHOLD_MS = 6 * ONE_DAY_MS; // Alerte quand il reste 1 jour

/**
 * Génère un token JWT
 * @param {Object} payload - Données à encoder dans le token
 * @returns {string} Token JWT
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} Payload décodé ou null si invalide
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return null;
  }
}

/**
 * Extrait le token de l'en-tête Authorization
 * @param {Object} event - Événement H3 de Nuxt
 * @returns {string|null} Token JWT ou null
 */
export function extractTokenFromHeader(event) {
  const authHeader = getRequestHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Enlever 'Bearer ' du début
}

/**
 * Vérifie si le token est proche de l'expiration (moins de 1 jour restant)
 * @param {string} token - Token JWT à vérifier
 * @returns {Object} { isExpiring: boolean, timeLeft: number (en millisecondes) }
 */
export function checkTokenExpiry(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = (decoded.exp - now) * 1000; // Temps restant en millisecondes
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    return {
      isExpiring: timeLeft < ALERT_THRESHOLD_MS && timeLeft > 0,
      timeLeft: timeLeft,
      isExpired: timeLeft <= 0,
      expiresAt: decoded.exp * 1000 // Convertir en millisecondes
    };
  } catch (error) {
    return { isExpiring: false, timeLeft: 0, isExpired: true };
  }
}

export default { generateToken, verifyToken, extractTokenFromHeader, checkTokenExpiry };
