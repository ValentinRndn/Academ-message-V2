/**
 * Modèle Availability pour MongoDB
 */

// Structure d'une disponibilité
const availabilitySchema = {
  teacherId: { type: String, required: true },
  dayOfWeek: { type: Number, required: true }, // 0-6, 0 = Sunday
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  recurring: { type: Boolean, default: true },
  date: { type: Date }, // Date spécifique si non récurrent
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe Availability pour interagir avec la collection Availability de MongoDB
 */
class Availability {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('Availability');
  }

  /**
   * Trouver toutes les disponibilités
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des disponibilités
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver une disponibilité par son ID
   * @param {string} id - ID de la disponibilité
   * @returns {Promise<Object>} Disponibilité trouvée ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Trouver les disponibilités d'un enseignant
   * @param {string} teacherId - ID de l'enseignant
   * @returns {Promise<Array>} Liste des disponibilités
   */
  async findByTeacherId(teacherId) {
    return this.collection.find({ teacherId }).toArray();
  }

  /**
   * Trouver les disponibilités pour un jour spécifique
   * @param {string} teacherId - ID de l'enseignant
   * @param {number} dayOfWeek - Jour de la semaine (0-6)
   * @returns {Promise<Array>} Liste des disponibilités
   */
  async findByDayOfWeek(teacherId, dayOfWeek) {
    return this.collection.find({
      teacherId,
      dayOfWeek,
      recurring: true
    }).toArray();
  }

  /**
   * Créer une nouvelle disponibilité
   * @param {Object} availabilityData - Données de la disponibilité
   * @returns {Promise<Object>} Disponibilité créée
   */
  async create(availabilityData) {
    availabilityData.createdAt = new Date();
    availabilityData.updatedAt = new Date();
    const result = await this.collection.insertOne(availabilityData);
    return { _id: result.insertedId, ...availabilityData };
  }

  /**
   * Mettre à jour une disponibilité
   * @param {string} id - ID de la disponibilité
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
   * Supprimer une disponibilité
   * @param {string} id - ID de la disponibilité
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }

  /**
   * Supprimer toutes les disponibilités d'un enseignant
   * @param {string} teacherId - ID de l'enseignant
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteByTeacherId(teacherId) {
    return this.collection.deleteMany({ teacherId });
  }
}

export default Availability;
