/**
 * Modèle Review pour MongoDB
 */

// Structure d'un avis
const reviewSchema = {
  teacherId: { type: String, required: true },
  studentId: { type: String, required: true },
  rating: { type: Number, required: true }, // 1-5
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe Review pour interagir avec la collection Review de MongoDB
 */
class Review {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('Review');
  }

  /**
   * Trouver tous les avis
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des avis
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver un avis par son ID
   * @param {string} id - ID de l'avis
   * @returns {Promise<Object>} Avis trouvé ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Trouver les avis d'un enseignant
   * @param {string} teacherId - ID de l'enseignant
   * @returns {Promise<Array>} Liste des avis
   */
  async findByTeacherId(teacherId) {
    return this.collection.find({ teacherId }).toArray();
  }

  /**
   * Calculer la note moyenne d'un enseignant
   * @param {string} teacherId - ID de l'enseignant
   * @returns {Promise<Object>} Objet avec la note moyenne et le nombre d'avis
   */
  async getAverageRating(teacherId) {
    const result = await this.collection.aggregate([
      { $match: { teacherId } },
      { 
        $group: { 
          _id: "$teacherId",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 }
        } 
      }
    ]).toArray();
    
    if (result.length === 0) {
      return { averageRating: 0, count: 0 };
    }
    
    return { 
      averageRating: parseFloat(result[0].averageRating.toFixed(1)), 
      count: result[0].count 
    };
  }

  /**
   * Créer un nouvel avis
   * @param {Object} reviewData - Données de l'avis
   * @returns {Promise<Object>} Avis créé
   */
  async create(reviewData) {
    reviewData.createdAt = new Date();
    reviewData.updatedAt = new Date();
    const result = await this.collection.insertOne(reviewData);
    return { _id: result.insertedId, ...reviewData };
  }

  /**
   * Mettre à jour un avis
   * @param {string} id - ID de l'avis
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
   * Supprimer un avis
   * @param {string} id - ID de l'avis
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}

export default Review;
