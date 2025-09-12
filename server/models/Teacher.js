import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
  // Référence vers l'utilisateur dans la collection User
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  availability: [{
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    recurring: {
      type: Boolean,
      default: true
    },
    date: {
      type: Date
    }
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  languages: [{
    type: String,
    enum: ['french', 'english', 'spanish', 'german', 'italian', 'chinese', 'japanese', 'arabic'],
    default: ['french', 'english']
  }],
  experience: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeAccountId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt avant la sauvegarde
teacherSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthode pour récupérer les informations utilisateur complètes
teacherSchema.methods.getUser = async function() {
  const { connectToMongoDB } = await import('../utils/mongodb.js');
  const { ObjectId } = await import('mongodb');
  
  const db = await connectToMongoDB();
  return db.collection('users').findOne({ _id: new ObjectId(this.userId) });
};

// Méthode pour vérifier si le professeur est disponible maintenant
teacherSchema.methods.isAvailableNow = function() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5); // Format "HH:MM"

  return this.availability.some(slot => {
    if (slot.dayOfWeek !== currentDay) return false;
    return slot.startTime <= currentTime && currentTime <= slot.endTime;
  });
};

// Méthode pour calculer la moyenne des notes
teacherSchema.methods.calculateAverageRating = async function() {
  const reviews = await this.model('Review').find({ teacher: this._id });
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = sum / reviews.length;
  this.reviewCount = reviews.length;
  await this.save();

  return this.averageRating;
};

export default model('Teacher', teacherSchema, 'teachers');
