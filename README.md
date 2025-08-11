# Academ Message

Une plateforme de messagerie et de réservation pour connecter étudiants et enseignants.

## Configuration MongoDB

### Prérequis

- [Node.js](https://nodejs.org/) (v14 ou supérieur)
- [MongoDB](https://www.mongodb.com/try/download/community) (installé et en cours d'exécution)

### Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/academ-message.git
cd academ-message
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données MongoDB :
```bash
npm run setup-mongo
```
Cette commande va :
- Créer un fichier `.env` avec les configurations nécessaires
- Générer le client Prisma
- Vérifier la connexion à MongoDB
- Proposer d'initialiser la base de données avec des données de démonstration

### Configuration manuelle

Si vous préférez configurer manuellement :

1. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
```
DATABASE_URL="mongodb://localhost:27017/academ-message-db"
JWT_SECRET="votre-secret-jwt-securise"
```

2. Générez le client Prisma :
```bash
npx prisma generate
```

3. Initialisez la base de données avec des données de démonstration :
```bash
node scripts/init-mongodb.js
```

### Lancement du serveur

```bash
npm run dev
```

## Structure de la base de données

### Collections principales

- **User** : Informations sur les utilisateurs (étudiants, enseignants, administrateurs)
- **Message** : Messages échangés entre les utilisateurs
- **Booking** : Réservations de sessions entre étudiants et enseignants
- **Subject** : Matières enseignées
- **Review** : Avis laissés par les étudiants sur les enseignants
- **Availability** : Disponibilités des enseignants

## Comptes de démonstration

- **Admin** : admin@example.com / adminpass123
- **Enseignant** : teacher@example.com / password123
- **Étudiant** : student@example.com / password123

## Scripts utiles

- **Tester la connexion MongoDB** : `node scripts/test-mongo-connection.js`
- **Initialiser la base de données** : `node scripts/init-mongodb.js`
- **Configuration complète** : `node scripts/setup-mongo.js`