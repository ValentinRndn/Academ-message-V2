import mongoose from 'mongoose';

// URL de connexion MongoDB
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/academ-message-db';

// Options de configuration Mongoose
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Variable pour stocker la connexion
let connection = null;

/**
 * Établit une connexion à la base de données MongoDB
 * @returns {Promise<mongoose.Connection>} La connexion à la base de données
 */
export async function connectToDatabase() {
  try {
    if (connection) {
      return connection;
    }

    // Connexion à MongoDB avec Mongoose
    await mongoose.connect(DATABASE_URL, options);
    connection = mongoose.connection;

    console.log('Connected to MongoDB successfully');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Ferme la connexion à la base de données
 */
export async function closeDatabaseConnection() {
  try {
    if (connection) {
      await mongoose.disconnect();
      connection = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

/**
 * Teste la connexion à la base de données
 * @returns {Promise<boolean>} true si la connexion est réussie
 */
export async function testDatabaseConnection() {
  try {
    await connectToDatabase();
    return mongoose.connection.readyState === 1;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Gestionnaire d'événements de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Gestionnaire pour la fermeture propre de la connexion
process.on('SIGINT', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});

export default { connectToDatabase, closeDatabaseConnection, testDatabaseConnection };
