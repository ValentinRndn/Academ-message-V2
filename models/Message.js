/**
 * Modèle Message pour MongoDB
 */

// Structure d'un message
const messageSchema = {
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

/**
 * Classe Message pour interagir avec la collection Message de MongoDB
 */
class Message {
  /**
   * @param {Object} db - Instance de la base de données MongoDB
   */
  constructor(db) {
    this.collection = db.collection('Message');
  }

  /**
   * Trouver tous les messages
   * @param {Object} filter - Filtre de recherche
   * @param {Object} options - Options de recherche (tri, limite, etc.)
   * @returns {Promise<Array>} Liste des messages
   */
  async findAll(filter = {}, options = {}) {
    return this.collection.find(filter, options).toArray();
  }

  /**
   * Trouver un message par son ID
   * @param {string} id - ID du message
   * @returns {Promise<Object>} Message trouvé ou null
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Trouver les messages d'une conversation entre deux utilisateurs
   * @param {string} user1Id - ID du premier utilisateur
   * @param {string} user2Id - ID du deuxième utilisateur
   * @returns {Promise<Array>} Liste des messages
   */
  async findConversation(user1Id, user2Id) {
    return this.collection.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ createdAt: 1 }).toArray();
  }

  /**
   * Trouver les derniers messages de toutes les conversations d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des derniers messages
   */
  async findUserConversations(userId) {
    // Cette requête est plus complexe et nécessite une agrégation MongoDB
    return this.collection.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" }
      }
    ]).toArray();
  }

  /**
   * Marquer un message comme lu
   * @param {string} id - ID du message
   * @returns {Promise<Object>} Résultat de la mise à jour
   */
  async markAsRead(id) {
    return this.collection.updateOne(
      { _id: id },
      { 
        $set: { 
          read: true,
          updatedAt: new Date() 
        } 
      }
    );
  }

  /**
   * Créer un nouveau message
   * @param {Object} messageData - Données du message
   * @returns {Promise<Object>} Message créé
   */
  async create(messageData) {
    messageData.createdAt = new Date();
    messageData.updatedAt = new Date();
    messageData.read = messageData.read || false;
    const result = await this.collection.insertOne(messageData);
    return { _id: result.insertedId, ...messageData };
  }

  /**
   * Supprimer un message
   * @param {string} id - ID du message
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}

export default Message;
