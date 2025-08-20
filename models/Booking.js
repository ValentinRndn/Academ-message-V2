/**
 * Modèle Booking pour MongoDB
 */

// Structure d'une réservation
const bookingSchema = {
  teacherId: { type: String, required: true },
  studentId: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, default: 'pending' }, // "pending", "confirmed", "cancelled", "completed"
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe Booking pour interagir avec la collection Booking de MongoDB
 */
class Booking {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('Booking');
  }

  /**
   * Trouver toutes les réservations
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des réservations
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver une réservation par son ID
   * @param {string} id - ID de la réservation
   * @returns {Promise<Object>} Réservation trouvée ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Trouver les réservations d'un enseignant
   * @param {string} teacherId - ID de l'enseignant
   * @returns {Promise<Array>} Liste des réservations
   */
  async findByTeacherId(teacherId) {
    return this.collection.find({ teacherId }).toArray();
  }

  /**
   * Trouver les réservations d'un étudiant
   * @param {string} studentId - ID de l'étudiant
   * @returns {Promise<Array>} Liste des réservations
   */
  async findByStudentId(studentId) {
    return this.collection.find({ studentId }).toArray();
  }

  /**
   * Trouver les réservations à une période donnée
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @returns {Promise<Array>} Liste des réservations
   */
  async findByDateRange(startDate, endDate) {
    return this.collection.find({
      $or: [
        { start: { $gte: startDate, $lte: endDate } },
        { end: { $gte: startDate, $lte: endDate } },
        { 
          $and: [
            { start: { $lte: startDate } },
            { end: { $gte: endDate } }
          ]
        }
      ]
    }).toArray();
  }

  /**
   * Créer une nouvelle réservation
   * @param {Object} bookingData - Données de la réservation
   * @returns {Promise<Object>} Réservation créée
   */
  async create(bookingData) {
    bookingData.createdAt = new Date();
    bookingData.updatedAt = new Date();
    const result = await this.collection.insertOne(bookingData);
    return { _id: result.insertedId, ...bookingData };
  }

  /**
   * Mettre à jour le statut d'une réservation
   * @param {string} id - ID de la réservation
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} Résultat de la mise à jour
   */
  async updateStatus(id, status) {
    return this.collection.updateOne(
      { _id: id },
      { 
        $set: { 
          status,
          updatedAt: new Date() 
        } 
      }
    );
  }

  /**
   * Mettre à jour une réservation
   * @param {string} id - ID de la réservation
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
   * Supprimer une réservation
   * @param {string} id - ID de la réservation
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}

export default Booking;
