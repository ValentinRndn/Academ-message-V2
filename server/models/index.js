// Export des modèles MongoDB
import { connectToMongoDB } from '../utils/mongodb.js';
import userModel from './userModel.js';

// Initialise les modèles avec la connexion à la base de données
export async function getModels() {
  try {
    const db = await connectToMongoDB();
    return {
      db,
      userModel
      // Ajouter d'autres modèles ici à mesure qu'ils sont créés
    };
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des modèles:', error);
    throw error;
  }
}

export default getModels;
