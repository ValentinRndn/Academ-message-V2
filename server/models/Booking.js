import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  // Référence vers le professeur
  teacherId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher',
    index: true
  },
  // Référence vers l'étudiant (User)
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  // Matière pour cette séance
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  // Date et heure de début
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  // Date et heure de fin
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  // Durée en minutes
  duration: {
    type: Number,
    required: true
  },
  // Statut de la réservation
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in_progress'],
    default: 'pending',
    index: true
  },
  // Statut du paiement
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  // Montant total (tarif professeur * durée + commission)
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Tarif horaire du professeur au moment de la réservation
  teacherHourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  // Commission de la plateforme (5€)
  platformCommission: {
    type: Number,
    default: 5,
    min: 0
  },
  // Montant que recevra le professeur (totalAmount - platformCommission)
  teacherAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Devise
  currency: {
    type: String,
    default: 'EUR'
  },
  // ID du paiement Stripe
  stripePaymentIntentId: {
    type: String,
    index: true
  },
  // Notes de l'étudiant
  studentNotes: {
    type: String,
    maxlength: 500
  },
  // Notes du professeur
  teacherNotes: {
    type: String,
    maxlength: 500
  },
  // Date d'annulation
  cancelledAt: {
    type: Date
  },
  // Raison de l'annulation
  cancellationReason: {
    type: String,
    maxlength: 200
  },
  // Qui a annulé (student/teacher/admin)
  cancelledBy: {
    type: String,
    enum: ['student', 'teacher', 'admin']
  },
  // Date de confirmation
  confirmedAt: {
    type: Date
  },
  // Date de début effective (pour les séances en cours)
  actualStartTime: {
    type: Date
  },
  // Date de fin effective
  actualEndTime: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour éviter les conflits d'horaires
bookingSchema.index({ teacherId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ studentId: 1, startTime: 1 });

// Virtual pour calculer si la séance est passée
bookingSchema.virtual('isPast').get(function() {
  return new Date() > this.endTime;
});

// Virtual pour calculer si la séance est en cours
bookingSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
});

// Virtual pour calculer si la séance peut être annulée (24h avant)
bookingSchema.virtual('canBeCancelled').get(function() {
  const now = new Date();
  const timeDiff = this.startTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff > 24 && this.status !== 'cancelled' && this.status !== 'completed';
});

// Middleware pour calculer automatiquement les montants
bookingSchema.pre('save', function(next) {
  if (this.isModified('duration') || this.isModified('teacherHourlyRate') || this.isModified('platformCommission')) {
    // Calculer le montant du professeur (durée en heures * tarif horaire)
    const durationInHours = this.duration / 60;
    this.teacherAmount = Math.round(durationInHours * this.teacherHourlyRate * 100) / 100;
    
    // Calculer le montant total (montant professeur + commission)
    this.totalAmount = Math.round((this.teacherAmount + this.platformCommission) * 100) / 100;
  }
  next();
});

// Méthode pour vérifier les conflits d'horaires
bookingSchema.statics.checkTimeConflict = async function(teacherId, startTime, endTime, excludeBookingId = null) {
  const query = {
    teacherId: teacherId,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      // Nouvelle séance commence pendant une séance existante
      { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
      // Nouvelle séance se termine pendant une séance existante
      { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
      // Nouvelle séance englobe une séance existante
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return conflictingBooking;
};

// Méthode pour confirmer une réservation
bookingSchema.methods.confirm = async function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  await this.save();
  return this;
};

// Méthode pour annuler une réservation
bookingSchema.methods.cancel = async function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  await this.save();
  return this;
};

// Méthode pour marquer comme en cours
bookingSchema.methods.start = async function() {
  this.status = 'in_progress';
  this.actualStartTime = new Date();
  await this.save();
  return this;
};

// Méthode pour marquer comme terminée
bookingSchema.methods.complete = async function() {
  this.status = 'completed';
  this.actualEndTime = new Date();
  await this.save();
  return this;
};

// Méthode statique pour récupérer les réservations d'un utilisateur
bookingSchema.statics.findByUser = function(userId, role = 'student') {
  const field = role === 'teacher' ? 'teacherId' : 'studentId';
  return this.find({ [field]: userId })
    .populate('teacherId', 'firstName lastName email')
    .populate('subjectId', 'name')
    .sort({ startTime: -1 });
};

export default model('Booking', bookingSchema);
