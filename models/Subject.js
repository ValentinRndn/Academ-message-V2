import { Schema, model } from 'mongoose';

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['sciences', 'languages', 'arts', 'humanities', 'technology', 'other'],
    default: 'other'
  },
  icon: {
    type: String,
    default: ''
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
subjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model('Subject', subjectSchema);