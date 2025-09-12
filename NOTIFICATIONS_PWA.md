# Configuration des Notifications PWA

Ce document explique comment configurer et utiliser le système de notifications push pour l'application Academ.

## Prérequis

1. **Clés VAPID** : Les clés VAPID sont nécessaires pour l'authentification des notifications push.
2. **Service Worker** : Le service worker doit être enregistré pour gérer les notifications.
3. **HTTPS** : Les notifications push ne fonctionnent qu'en HTTPS (sauf en localhost).

## Configuration

### 1. Génération des clés VAPID

Pour générer de nouvelles clés VAPID :

```bash
node scripts/generate-vapid-keys.js
```

Cela affichera les clés à ajouter dans votre fichier `.env` :

```env
VAPID_PUBLIC_KEY=votre_clé_publique_vapid
VAPID_PRIVATE_KEY=votre_clé_privée_vapid
```

### 2. Configuration du fichier .env

Ajoutez les clés VAPID à votre fichier `.env` :

```env
# Configuration de la base de données
DATABASE_URL=mongodb://localhost:27017/academ

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=7d

# Clés VAPID pour les notifications push
VAPID_PUBLIC_KEY=votre_clé_publique_vapid
VAPID_PRIVATE_KEY=votre_clé_privée_vapid
```

### 3. Redémarrage du serveur

Après avoir ajouté les clés VAPID, redémarrez le serveur de développement :

```bash
npm run dev
```

## Utilisation

### Activation des notifications

1. Connectez-vous à l'application
2. Allez dans votre profil (étudiant ou professeur)
3. Dans la section "Notifications", cliquez sur "Activer"
4. Autorisez les notifications dans votre navigateur

### Test des notifications

Une fois les notifications activées, vous pouvez tester en cliquant sur le bouton "Tester" dans la section notifications de votre profil.

### Types de notifications

Le système envoie automatiquement des notifications pour :

- **Nouvelles réservations** : Quand un étudiant réserve un cours
- **Confirmations/Annulations** : Quand un cours est confirmé ou annulé
- **Nouveaux messages** : Quand vous recevez un nouveau message
- **Rappels de cours** : 1 heure avant le début d'un cours
- **Nouveaux avis** : Quand un étudiant laisse un avis
- **Paiements confirmés** : Quand un paiement est validé

## Architecture technique

### Composants

- `NotificationToggle.vue` : Interface utilisateur pour gérer les notifications
- `useNotifications.ts` : Composable pour la logique des notifications
- `sw.js` : Service Worker pour gérer les notifications push

### API Endpoints

- `POST /api/notifications/subscribe` : S'abonner aux notifications
- `POST /api/notifications/unsubscribe` : Se désabonner des notifications
- `POST /api/notifications/send` : Envoyer une notification
- `POST /api/notifications/test` : Tester les notifications

### Base de données

Les abonnements sont stockés dans la collection `push_subscriptions` avec la structure :

```javascript
{
  userId: ObjectId,
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  },
  createdAt: Date
}
```

## Dépannage

### Problèmes courants

1. **"Les notifications ne sont pas supportées"**
   - Vérifiez que vous utilisez HTTPS ou localhost
   - Vérifiez que votre navigateur supporte les notifications push

2. **"Permission refusée"**
   - Allez dans les paramètres de votre navigateur
   - Autorisez les notifications pour ce site
   - Rechargez la page

3. **"Clés VAPID non configurées"**
   - Vérifiez que les clés VAPID sont dans le fichier `.env`
   - Redémarrez le serveur

4. **"Aucun abonnement trouvé"**
   - Activez d'abord les notifications dans votre profil
   - Vérifiez que vous êtes connecté

### Logs de débogage

Les logs de débogage sont disponibles dans :
- Console du navigateur (F12)
- Console du serveur (terminal)

## Sécurité

- Les clés VAPID privées ne doivent jamais être exposées côté client
- Les notifications ne sont envoyées qu'aux utilisateurs authentifiés
- Les abonnements invalides sont automatiquement supprimés

## Support des navigateurs

- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

## Ressources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
