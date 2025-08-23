import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Référence vers la réservation
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Référence vers l'étudiant qui a laissé l'avis
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Référence vers le professeur évalué
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Note sur 5 étoiles
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Commentaire de l'étudiant
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  
  // Tags/catégories pour l'avis (ex: "Pédagogie", "Ponctualité", etc.)
  tags: [{
    type: String,
    trim: true
  }],
  
  // Réponse du professeur
  reply: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  
  // Date de la réponse du professeur
  replyDate: {
    type: Date
  },
  
  // Statut de l'avis
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  
  // Indicateur si l'avis est anonyme
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour optimiser les requêtes
reviewSchema.index({ teacherId: 1, createdAt: -1 });
reviewSchema.index({ studentId: 1, createdAt: -1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Méthode pour calculer la note moyenne d'un professeur
reviewSchema.statics.getAverageRating = async function(teacherId) {
  const result = await this.aggregate([
    { $match: { teacherId: new mongoose.Types.ObjectId(teacherId), status: 'approved' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  } : { averageRating: 0, totalReviews: 0 };
};

// Méthode pour obtenir la répartition des notes
reviewSchema.statics.getRatingDistribution = async function(teacherId) {
  const result = await this.aggregate([
    { $match: { teacherId: new mongoose.Types.ObjectId(teacherId), status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
  
  const distribution = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = 0;
  }
  
  result.forEach(item => {
    distribution[item._id] = item.count;
  });
  
  return distribution;
};

// Validation personnalisée
reviewSchema.pre('save', function(next) {
  // Vérifier qu'un étudiant ne peut pas laisser plusieurs avis pour la même réservation
  if (this.isNew) {
    this.constructor.findOne({
      bookingId: this.bookingId,
      studentId: this.studentId
    }).then(existingReview => {
      if (existingReview) {
        next(new Error('Un avis existe déjà pour cette réservation'));
      } else {
        next();
      }
    }).catch(next);
  } else {
    next();
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
