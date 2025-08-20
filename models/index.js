/**
 * Export des modèles pour une utilisation facile
 */

import User from './User.js';
import Subject from './Subject.js';
import Message from './Message.js';
import Booking from './Booking.js';
import Availability from './Availability.js';
import Review from './Review.js';
import { connectToDatabase } from '../config/database.js';

/**
 * Initialise et exporte tous les modèles
 * @returns {Promise<Object>} Objet contenant tous les modèles
 */
async function initModels() {
  const db = await connectToDatabase();
  
  return {
    User: new User(db),
    Subject: new Subject(db),
    Message: new Message(db),
    Booking: new Booking(db),
    Availability: new Availability(db),
    Review: new Review(db)
  };
}

export default initModels;
