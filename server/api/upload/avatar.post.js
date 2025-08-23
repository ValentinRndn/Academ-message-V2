import { connectToDatabase } from '../../config/database.js';
import { updateUser } from '../../models/userModel.js';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est authentifié
    const auth = event.context.auth;
    if (!auth || !auth.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentification requise'
      });
    }

    // Récupérer les données du formulaire multipart
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Aucun fichier fourni'
      });
    }

    // Trouver le fichier dans les données du formulaire
    const fileData = formData.find(item => item.name === 'avatar');
    
    if (!fileData || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Fichier avatar manquant'
      });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileData.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP'
      });
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileData.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Fichier trop volumineux. Taille maximum : 5MB'
      });
    }

    // Générer un nom de fichier unique
    const fileExtension = fileData.filename.split('.').pop().toLowerCase();
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Créer le dossier de destination s'il n'existe pas
    const uploadDir = join(__dirname, '../../../public/uploads/avatars');
    await mkdir(uploadDir, { recursive: true });
    
    // Chemin complet du fichier
    const filePath = join(uploadDir, fileName);
    
    // Écrire le fichier
    await writeFile(filePath, fileData.data);
    
    // URL relative pour accéder au fichier
    const avatarUrl = `/uploads/avatars/${fileName}`;
    
    // Mettre à jour l'avatar de l'utilisateur dans la base de données
    const updatedUser = await updateUser(auth.user._id, {
      avatar: avatarUrl,
      updatedAt: new Date()
    });
    
    if (!updatedUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Erreur lors de la mise à jour du profil'
      });
    }

    return {
      success: true,
      avatarUrl,
      message: 'Avatar mis à jour avec succès'
    };

  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'avatar:', error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l\'upload de l\'avatar'
    });
  }
});
