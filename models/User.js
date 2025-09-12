/**
 * Modèle User pour MongoDB
 */

// Structure d'un utilisateur
const userSchema = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // "student", "teacher", or "admin"
  bio: { type: String },
  avatar: { type: String },
  status: { type: String, default: "active" }, // "active", "inactive", "suspended"
  lastLoginAt: { type: Date },
  subjectIds: { type: Array },
  stripeCustomerId: { type: String }, // ID Stripe pour les paiements
  stripeAccountId: { type: String }, // ID compte Stripe Connect pour les professeurs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe User pour interagir avec la collection User de MongoDB
 */
class User {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('users');
  }

  /**
   * Trouver tous les utilisateurs
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des utilisateurs
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver un utilisateur par son ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Utilisateur trouvé ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Trouver un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object>} Utilisateur trouvé ou null
   */
  async findByEmail(email) {
    return this.collection.findOne({ email });
  }

  /**
   * Trouver des enseignants par matière
   * @param {string} subjectId - ID de la matière
   * @returns {Promise<Array>} Liste des enseignants
   */
  async findTeachersBySubject(subjectId) {
    return this.collection.find({
      role: 'teacher',
      subjectIds: subjectId
    }).toArray();
  }

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé
   */
  async create(userData) {
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
    const result = await this.collection.insertOne(userData);
    return { _id: result.insertedId, ...userData };
  }

  /**
   * Mettre à jour un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Résultat de la mise à jour
   */
  async update(id, updateData) {
    updateData.updatedAt = new Date();
    return this.collection.updateOne(
      { _id: id },
      { $set: updateData }
    );
  }

  /**
   * Supprimer un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}

export default User;
