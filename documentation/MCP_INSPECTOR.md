# Utilisation de MCP Inspector

MCP Inspector est un outil de développement et de débogage qui fournit une interface web pour tester et explorer les serveurs MCP en temps réel.

## Installation

MCP Inspector est automatiquement disponible via npx, aucune installation supplémentaire n'est nécessaire.

## Utilisation

### 1. Build du projet

Assurez-vous d'abord que le projet est compilé :

```bash
npm run build
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec vos credentials LayerOps :

```env
LAYEROPS_API_KEY_ID=your-key-id
LAYEROPS_API_KEY_SECRET=your-api-key-secret
LAYEROPS_API_BASE_URL=https://api.layerops.io
```

**Important** : Le fichier `.env` est chargé automatiquement par le script `inspect-with-env.js`. Le serveur MCP lui-même ne charge PAS le fichier `.env` - c'est MCP Inspector qui transmet ces variables d'environnement au serveur.

### 3. Lancement de MCP Inspector

Lancez MCP Inspector avec la commande :

```bash
npm run inspect
```

Cette commande va :
1. Charger les variables d'environnement depuis le fichier `.env`
2. Démarrer MCP Inspector avec ces variables
3. Transmettre les variables au serveur MCP
4. Ouvrir une interface web dans votre navigateur
5. Vous permettre de tester les tools et ressources

### 4. Utilisation de l'interface

Une fois l'interface ouverte, vous pouvez :

- **Explorer les tools** : Voir tous les tools disponibles et leurs schémas
- **Tester les tools** : Exécuter des tools avec des paramètres personnalisés
- **Consulter les ressources** : Accéder à la documentation LayerOps
- **Voir les réponses** : Observer les réponses de l'API en temps réel

## Exemples de tests

### Tester la liste des projets

1. Dans l'interface MCP Inspector, sélectionnez le tool `layerops_list_projects`
2. Cliquez sur "Call Tool"
3. Observez la réponse de l'API

### Tester la création d'une instance

1. Sélectionnez le tool `layerops_create_instance`
2. Remplissez les paramètres :
   ```json
   {
     "name": "test-instance",
     "instanceType": "t2.micro",
     "region": "eu-west-1",
     "environmentId": "env-123"
   }
   ```
3. Cliquez sur "Call Tool"
4. Vérifiez la réponse

### Consulter la documentation

1. Dans la section "Resources", sélectionnez une ressource (ex: `layerops://docs/introduction`)
2. Cliquez sur "Read Resource"
3. Consultez le contenu de la documentation

## Dépannage

### Le serveur ne démarre pas

- Vérifiez que le fichier `.env` existe et contient les variables nécessaires
- Vérifiez que les variables d'environnement sont correctement définies dans `.env`
- Vérifiez que le projet est compilé (`npm run build`)
- Consultez les logs dans la console

### Les variables d'environnement ne sont pas chargées

Le script `scripts/inspect-with-env.js` charge automatiquement le fichier `.env` et transmet les variables à MCP Inspector. Si les variables ne sont pas chargées :

- Vérifiez que le fichier `.env` est à la racine du projet
- Vérifiez le format du fichier `.env` (une variable par ligne, format `KEY=value`)
- Vérifiez que les noms des variables commencent par `LAYEROPS_`
- Les variables d'environnement système ont la priorité sur celles du fichier `.env`

### Les tools retournent des erreurs

- Vérifiez que vos credentials LayerOps sont valides
- Vérifiez que l'API LayerOps est accessible
- Consultez les messages d'erreur pour plus de détails

### L'interface ne s'ouvre pas

- Vérifiez que le port par défaut (5173) n'est pas déjà utilisé
- Essayez d'ouvrir manuellement l'URL affichée dans la console

## Ressources

- [Documentation MCP Inspector](https://www.pulsemcp.com/clients/inspector)
- [Documentation LayerOps](https://doc.layerops.io/)

