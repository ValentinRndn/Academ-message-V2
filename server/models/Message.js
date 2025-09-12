import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  // Référence vers l'expéditeur (User ID)
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  // Référence vers le destinataire (User ID)
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  // Contenu du message
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  // Type de message (texte, image, fichier, etc.)
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  // Statut de lecture
  read: {
    type: Boolean,
    default: false
  },
  // Date de lecture
  readAt: {
    type: Date,
    default: null
  },
  // Référence à la conversation
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  // Message supprimé (soft delete)
  deleted: {
    type: Boolean,
    default: false
  },
  // Date de suppression
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour optimiser les requêtes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });

// Méthode pour marquer un message comme lu
messageSchema.methods.markAsRead = async function() {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Méthode pour supprimer un message (soft delete)
messageSchema.methods.softDelete = async function() {
  this.deleted = true;
  this.deletedAt = new Date();
  await this.save();
  return this;
};

// Méthode statique pour marquer tous les messages d'une conversation comme lus
messageSchema.statics.markConversationAsRead = async function(conversationId, userId) {
  return this.updateMany(
    { 
      conversationId: conversationId,
      receiverId: userId,
      read: false 
    },
    { 
      read: true,
      readAt: new Date()
    }
  );
};

export default model('Message', messageSchema);
