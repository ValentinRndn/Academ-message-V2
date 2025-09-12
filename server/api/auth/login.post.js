// API de connexion
import { comparePassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { findUserByEmail, updateLastLogin } from '../../models/userModel.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('Received login request with body:', body);
    const { email, password } = body;
    
    // Valider les données
    if (!email || !password) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Email et mot de passe sont obligatoires'
      });
    }
    
    // Trouver l'utilisateur
    const user = await findUserByEmail(email);
    console.log('Found user:', user);
    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier si le compte est actif
    if (user.status !== 'active') {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Votre compte est désactivé'
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Mettre à jour la date de dernière connexion
    await updateLastLogin(user._id);
    
    // Générer un token JWT
    const token = generateToken({
      userId: user._id,
      role: user.role
    });
    
    // Masquer le mot de passe dans la réponse
    const { password: _, ...safeUser } = user;
    
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
    console.error('Erreur lors de la connexion:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erreur lors de la connexion'
    });
  }
});