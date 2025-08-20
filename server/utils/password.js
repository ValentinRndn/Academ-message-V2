// Utilitaire pour la gestion des mots de passe
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hache un mot de passe
 * @param {string} password - Le mot de passe en clair
 * @returns {Promise<string>} Le mot de passe haché
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un hash
 * @param {string} password - Le mot de passe en clair
 * @param {string} hash - Le hash du mot de passe
 * @returns {Promise<boolean>} true si les mots de passe correspondent
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export default { hashPassword, comparePassword };
