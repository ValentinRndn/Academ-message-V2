import { Schema, model } from 'mongoose';

const conversationSchema = new Schema({
  // Participants de la conversation (toujours 2 pour ce système)
  participants: [{
    type: Schema.Types.ObjectId,
    required: true
  }],
  // Dernier message de la conversation
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  // Date du dernier message
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  // Participants qui ont supprimé la conversation
  deletedBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Conversation archivée par les participants
  archivedBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    archivedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Type de conversation (direct message pour l'instant)
  type: {
    type: String,
    enum: ['dm'], // dm = direct message
    default: 'dm'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour optimiser les requêtes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Virtual pour récupérer les messages de la conversation
conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
  options: { sort: { createdAt: 1 } }
});

// Méthode pour trouver ou créer une conversation entre deux utilisateurs
conversationSchema.statics.findOrCreate = async function(userId1, userId2) {
  // Créer un tableau ordonné pour la recherche
  const participants = [userId1, userId2].sort();
  
  // Chercher une conversation existante
  let conversation = await this.findOne({
    participants: { $all: participants, $size: 2 }
  });
  
  // Si elle n'existe pas, la créer
  if (!conversation) {
    conversation = await this.create({
      participants: participants,
      type: 'dm'
    });
  }
  
  return conversation;
};

// Méthode pour mettre à jour le dernier message
conversationSchema.methods.updateLastMessage = async function(messageId) {
  this.lastMessage = messageId;
  this.lastMessageAt = new Date();
  await this.save();
  return this;
};

// Méthode pour archiver une conversation pour un utilisateur
conversationSchema.methods.archiveFor = async function(userId) {
  const existingArchive = this.archivedBy.find(
    archive => archive.userId.toString() === userId.toString()
  );
  
  if (!existingArchive) {
    this.archivedBy.push({
      userId: userId,
      archivedAt: new Date()
    });
    await this.save();
  }
  
  return this;
};

// Méthode pour désarchiver une conversation pour un utilisateur
conversationSchema.methods.unarchiveFor = async function(userId) {
  this.archivedBy = this.archivedBy.filter(
    archive => archive.userId.toString() !== userId.toString()
  );
  await this.save();
  return this;
};

// Méthode pour supprimer une conversation pour un utilisateur
conversationSchema.methods.deleteFor = async function(userId) {
  const existingDelete = this.deletedBy.find(
    del => del.userId.toString() === userId.toString()
  );
  
  if (!existingDelete) {
    this.deletedBy.push({
      userId: userId,
      deletedAt: new Date()
    });
    await this.save();
  }
  
  return this;
};

// Méthode pour obtenir l'autre participant d'une conversation
conversationSchema.methods.getOtherParticipant = function(currentUserId) {
  return this.participants.find(
    participantId => participantId.toString() !== currentUserId.toString()
  );
};

// Méthode pour vérifier si un utilisateur fait partie de la conversation
conversationSchema.methods.hasParticipant = function(userId) {
  return this.participants.some(
    participantId => participantId.toString() === userId.toString()
  );
};

export default model('Conversation', conversationSchema);
