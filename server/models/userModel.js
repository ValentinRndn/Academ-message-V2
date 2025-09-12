// Modèle User pour interagir avec la collection User de MongoDB
import { connectToMongoDB } from '../utils/mongodb.js';
import { ObjectId } from 'mongodb';

/**
 * Trouve tous les utilisateurs correspondant au filtre
 * @param {Object} filter - Filtre de recherche
 * @returns {Promise<Array>} Liste des utilisateurs
 */
export async function findUsers(filter = {}) {
  const db = await connectToMongoDB();
  return db.collection('users').find(filter).toArray();
}

/**
 * Trouve un utilisateur par son ID
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Utilisateur trouvé ou null
 */
export async function findUserById(id) {
  const db = await connectToMongoDB();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  return db.collection('users').findOne({ _id: objectId });
}

/**
 * Trouve un utilisateur par son email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Utilisateur trouvé ou null
 */
export async function findUserByEmail(email) {
  const db = await connectToMongoDB();
  return db.collection('users').findOne({ email });
}

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} Utilisateur créé
 */
export async function createUser(userData) {
  const db = await connectToMongoDB();
  userData.createdAt = new Date();
  userData.updatedAt = new Date();
  const result = await db.collection('users').insertOne(userData);
  return { _id: result.insertedId, ...userData };
}

/**
 * Met à jour un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
export async function updateUser(id, updateData) {
  const db = await connectToMongoDB();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  
  updateData.updatedAt = new Date();
  const result = await db.collection('users').updateOne(
    { _id: objectId },
    { $set: updateData }
  );
  
  return result;
}

/**
 * Supprime un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Résultat de la suppression
 */
export async function deleteUser(id) {
  const db = await connectToMongoDB();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  return db.collection('users').deleteOne({ _id: objectId });
}

/**
 * Trouve tous les enseignants
 * @returns {Promise<Array>} Liste des enseignants
 */
export async function findTeachers() {
  return findUsers({ role: 'teacher' });
}

/**
 * Met à jour la date de dernière connexion
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
export async function updateLastLogin(id) {
  return updateUser(id, { lastLoginAt: new Date() });
}

export default {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  findTeachers,
  updateLastLogin
};
