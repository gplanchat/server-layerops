# Guide de démarrage rapide

Ce guide vous aidera à démarrer rapidement avec le serveur MCP LayerOps.

## Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer les variables d'environnement** :
Créez un fichier `.env` à la racine :
```env
LAYEROPS_API_KEY_ID=your-key-id
LAYEROPS_API_KEY_SECRET=your-api-key-secret
LAYEROPS_API_BASE_URL=https://api.layerops.io
```

Pour obtenir vos clés API, consultez la [documentation LayerOps](https://doc.layerops.io/security/api-keys/).

## Compilation

```bash
npm run build
```

## Utilisation

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm start
```

### Avec MCP Inspector

1. Compilez le projet :
```bash
npm run build
```

2. Lancez MCP Inspector :
```bash
npm run inspect
```

3. L'interface web s'ouvrira automatiquement dans votre navigateur

## Structure du projet

```
server-layerops/
├── src/                    # Code source TypeScript
│   ├── api/               # Client API LayerOps
│   ├── auth/              # Gestion de l'authentification
│   ├── resources/         # Ressources MCP (documentation)
│   ├── tools/             # Tools MCP (actions API)
│   ├── prompts/           # Prompts pour la gestion
│   ├── types/             # Types TypeScript
│   └── index.ts           # Point d'entrée
├── documentation/          # Documentation complète
│   ├── features/         # Documentation des fonctionnalités
│   ├── ARCHITECTURE.md    # Architecture du serveur
│   ├── MCP_INSPECTOR.md   # Guide MCP Inspector
│   └── prompts.md         # Documentation des prompts
└── package.json
```

## Fonctionnalités principales

### Tools MCP (30+)

- **Projets** : Liste, création, consultation, suppression
- **Environnements** : Gestion complète des environnements
- **Instances** : Création, contrôle (start/stop/restart), suppression
- **Pools d'instances** : Gestion avec autoscaling
- **Services** : Déploiement depuis Docker, mise à l'échelle
- **Événements** : Consultation de l'historique
- **Monitoring** : Métriques d'instances et services
- **Analytics** : Analyse des coûts et performances
- **RBAC** : Gestion des rôles et permissions

### Ressources MCP (8)

Accès direct à la documentation LayerOps :
- Introduction
- API
- Sécurité
- Instances
- Services
- Monitoring
- RBAC
- Environnements

## Exemples d'utilisation

### Créer un projet

```json
{
  "tool": "layerops_create_project",
  "arguments": {
    "name": "Mon Projet"
  }
}
```

### Créer une instance

```json
{
  "tool": "layerops_create_instance",
  "arguments": {
    "name": "web-server",
    "instanceType": "t2.micro",
    "region": "eu-west-1",
    "environmentId": "env-123"
  }
}
```

### Déployer un service

```json
{
  "tool": "layerops_create_service",
  "arguments": {
    "name": "api-service",
    "image": "nginx:latest",
    "environmentId": "env-123",
    "replicas": 3
  }
}
```

## Documentation complète

- [README.md](README.md) - Documentation principale
- [ARCHITECTURE.md](documentation/ARCHITECTURE.md) - Architecture détaillée
- [MCP_INSPECTOR.md](documentation/MCP_INSPECTOR.md) - Guide MCP Inspector
- [prompts.md](documentation/prompts.md) - Documentation des prompts
- [features/](documentation/features/) - Documentation des fonctionnalités

## Support

Pour toute question ou problème :
1. Consultez la documentation dans `documentation/`
2. Utilisez MCP Inspector pour déboguer
3. Vérifiez les logs du serveur

## Prochaines étapes

1. ✅ Installer les dépendances
2. ✅ Configurer les variables d'environnement
3. ✅ Compiler le projet
4. ✅ Tester avec MCP Inspector
5. ✅ Intégrer avec votre client MCP

Bon développement ! 🚀

