/**
 * Modèle Subject pour MongoDB
 */

// Structure d'une matière
const subjectSchema = {
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe Subject pour interagir avec la collection Subject de MongoDB
 */
class Subject {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('Subject');
  }

  /**
   * Trouver toutes les matières
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des matières
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver une matière par son ID
   * @param {string} id - ID de la matière
   * @returns {Promise<Object>} Matière trouvée ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Créer une nouvelle matière
   * @param {Object} subjectData - Données de la matière
   * @returns {Promise<Object>} Matière créée
   */
  async create(subjectData) {
    subjectData.createdAt = new Date();
    subjectData.updatedAt = new Date();
    const result = await this.collection.insertOne(subjectData);
    return { _id: result.insertedId, ...subjectData };
  }

  /**
   * Mettre à jour une matière
   * @param {string} id - ID de la matière
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
   * Supprimer une matière
   * @param {string} id - ID de la matière
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}

export default Subject;
