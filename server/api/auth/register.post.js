// API d'inscription
import { hashPassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { createUser, findUserByEmail } from '../../models/userModel.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { firstName, lastName, email, password, role = 'student' } = body;
    
    // Valider les données
    if (!firstName || !lastName || !email || !password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Tous les champs sont obligatoires'
      });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Cet email est déjà utilisé'
      });
    }
    
    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Déterminer le statut initial en fonction du rôle
    const initialStatus = role === 'teacher' ? 'pending' : 'active';
    
    // Créer l'utilisateur
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role,
      bio: body.bio || '',
      avatar: body.avatar || '',
      subjectIds: body.subjectIds || [],
      status: initialStatus,
      lastLoginAt: new Date()
    });
    
    // Générer un token JWT
    const token = generateToken({
      userId: newUser._id,
      role: newUser.role
    });
    
    // Masquer le mot de passe dans la réponse
    const { password: _, ...safeUser } = newUser;
    
    // Définir le cookie avec le token
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
      path: '/'
    });
    
    return {
      user: safeUser
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de l\'inscription'
    });
  }
});