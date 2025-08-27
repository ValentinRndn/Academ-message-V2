# Configuration SMTP pour l'envoi d'emails

## Vue d'ensemble

Academ Message utilise Nodemailer pour envoyer des emails automatiques (emails de bienvenue, notifications, etc.). Pour que cette fonctionnalité fonctionne, vous devez configurer les variables d'environnement SMTP.

## Configuration avec Gmail

### 1. Créer un mot de passe d'application Gmail

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur "Sécurité"
3. Activez la "Validation en 2 étapes" si ce n'est pas déjà fait
4. Cliquez sur "Mots de passe d'application"
5. Sélectionnez "Autre (nom personnalisé)" et nommez-le "Academ Message"
6. Copiez le mot de passe généré (16 caractères)

### 2. Créer le fichier .env

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Configuration de la base de données
DATABASE_URL=mongodb://localhost:27017/academ-message-db

# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app-16-caracteres
SMTP_FROM=noreply@academ-message.com

# URL de base de l'application
BASE_URL=http://localhost:3001

# Clés VAPID pour les notifications push (optionnel)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 3. Redémarrer le serveur

Après avoir créé le fichier `.env`, redémarrez le serveur de développement :

```bash
npm run dev
```

## Configuration avec d'autres fournisseurs

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=votre-email@outlook.com
SMTP_PASS=votre-mot-de-passe
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=votre-email@yahoo.com
SMTP_PASS=votre-mot-de-passe-app
```

### Serveur SMTP personnalisé
```env
SMTP_HOST=votre-serveur-smtp.com
SMTP_PORT=587
SMTP_USER=votre-utilisateur
SMTP_PASS=votre-mot-de-passe
```

## Test de la configuration

Une fois configuré, vous pouvez tester l'envoi d'emails en créant un nouveau professeur via l'interface d'administration. Si la configuration est correcte, vous devriez voir :

1. Un message de succès indiquant que l'email a été envoyé
2. Un email de bienvenue dans la boîte de réception du professeur

## Dépannage

### Erreur "Variables SMTP non configurées"
- Vérifiez que le fichier `.env` existe à la racine du projet
- Vérifiez que toutes les variables SMTP sont définies
- Redémarrez le serveur après avoir modifié le fichier `.env`

### Erreur d'authentification
- Vérifiez que l'email et le mot de passe sont corrects
- Pour Gmail, assurez-vous d'utiliser un mot de passe d'application, pas votre mot de passe principal
- Vérifiez que la validation en 2 étapes est activée (pour Gmail)

### Erreur de connexion
- Vérifiez que le port SMTP est correct (587 pour TLS, 465 pour SSL)
- Vérifiez que votre pare-feu n'empêche pas la connexion
- Essayez avec `secure: false` pour le port 587 ou `secure: true` pour le port 465

## Sécurité

- Ne committez jamais le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore` pour éviter cela
- Utilisez des mots de passe d'application plutôt que vos mots de passe principaux
- Changez régulièrement vos mots de passe d'application

## Emails envoyés automatiquement

- **Email de bienvenue** : Envoyé aux nouveaux professeurs avec leurs identifiants de connexion
- **Notifications de réservation** : Envoyées aux professeurs lors de nouvelles demandes de cours
- **Notifications de messages** : Envoyées lors de nouveaux messages (si configuré)
