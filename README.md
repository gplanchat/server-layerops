# LayerOps MCP Server

Serveur MCP (Model Context Protocol) pour interagir avec l'API LayerOps. Ce serveur permet de gérer programmatiquement votre infrastructure LayerOps via le protocole MCP.

## ⚠️ AVERTISSEMENT IMPORTANT

**Ce projet est expérimental et ne doit en aucun cas être utilisé sur une infrastructure de production.**

- ❌ **NE PAS utiliser ce serveur MCP avec des tokens API donnant accès à une infrastructure de production**
- ❌ **NE PAS déployer ce serveur dans un environnement de production**
- ✅ **Utiliser uniquement avec des environnements de développement, de test ou de staging**
- ✅ **Utiliser uniquement des tokens API avec des permissions limitées aux environnements non-critiques**

Ce projet est un Proof of Concept (POC) et peut contenir des bugs, des failles de sécurité ou des comportements inattendus. Utilisez-le à vos propres risques et uniquement dans des environnements où une panne ou une perte de données ne causerait pas de dommages.

## Fonctionnalités

- ✅ **Gestion complète de l'infrastructure** : Projets, environnements, instances, pools, services
- ✅ **Monitoring et analytics** : Accès aux métriques et analyses de coûts
- ✅ **RBAC** : Gestion des rôles et permissions
- ✅ **Événements** : Suivi de l'historique des actions
- ✅ **Ressources de documentation** : Accès direct à la documentation LayerOps
- ✅ **Authentification flexible** : Support des tokens API avec préparation pour OAuth2
- ✅ **MCP Inspector** : Outil de débogage intégré

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet :

```env
LAYEROPS_API_KEY_ID=your-key-id
LAYEROPS_API_KEY_SECRET=your-api-key-secret
LAYEROPS_API_BASE_URL=https://api.layerops.io
```

Pour obtenir vos clés API, consultez la [documentation LayerOps](https://doc.layerops.io/security/api-keys/).

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## MCP Inspector

MCP Inspector permet de tester et déboguer le serveur MCP via une interface web.

### Utilisation

1. Créez un fichier `.env` à la racine avec vos credentials :
```env
LAYEROPS_API_KEY_ID=your-key-id
LAYEROPS_API_KEY_SECRET=your-api-key-secret
LAYEROPS_API_BASE_URL=https://api.layerops.io
```

2. Compilez le projet :
```bash
npm run build
```

3. Lancez MCP Inspector :
```bash
npm run inspect
```

Le script `inspect` charge automatiquement le fichier `.env` et transmet les variables d'environnement à MCP Inspector, qui les passe ensuite au serveur MCP. **Le serveur MCP lui-même ne charge pas le fichier `.env`** - c'est MCP Inspector qui gère cela.

4. L'interface web s'ouvrira automatiquement dans votre navigateur

Pour plus de détails, consultez [documentation/MCP_INSPECTOR.md](documentation/MCP_INSPECTOR.md).

## Documentation

### Fonctionnalités

La documentation complète des fonctionnalités est disponible dans le dossier `documentation/features/` :

- [FEATURE001 - Gestion des projets](documentation/features/FEATURE001-gestion-projets.md)
- [FEATURE002 - Gestion des environnements](documentation/features/FEATURE002-gestion-environnements.md)
- [FEATURE003 - Gestion des instances](documentation/features/FEATURE003-gestion-instances.md)
- [FEATURE004 - Gestion des pools d'instances](documentation/features/FEATURE004-gestion-pools-instances.md)
- [FEATURE005 - Gestion des services](documentation/features/FEATURE005-gestion-services.md)
- [FEATURE006 - Gestion des événements](documentation/features/FEATURE006-gestion-evenements.md)
- [FEATURE007 - Monitoring](documentation/features/FEATURE007-monitoring.md)
- [FEATURE008 - Analytics](documentation/features/FEATURE008-analytics.md)
- [FEATURE009 - RBAC](documentation/features/FEATURE009-rbac.md)
- [FEATURE010 - Ressources de documentation](documentation/features/FEATURE010-ressources-documentation.md)
- [FEATURE011 - Authentification](documentation/features/FEATURE011-authentification.md)
- [FEATURE012 - Conversion Docker Compose](documentation/features/FEATURE012-conversion-docker-compose.md)
- [FEATURE013 - Conversion Helm](documentation/features/FEATURE013-conversion-helm.md)

### Prompts

Les prompts pour la gestion de l'infrastructure sont documentés dans [documentation/prompts.md](documentation/prompts.md).

**Note importante** : Les prompts sont conçus pour être utilisés par des agents LLM et contiennent des instructions détaillées, des séquences d'actions étape par étape, des exemples concrets, et des validations. Chaque prompt guide l'agent à travers toutes les étapes nécessaires avec gestion d'erreurs et recommandations.

**Fonctionnalités spéciales** :
- Le prompt `layerops-convert-docker-compose` permet de convertir automatiquement un fichier Docker Compose en spécification LayerOps
- Le prompt `layerops-convert-helm` permet de convertir un chart Helm/Kubernetes en spécification LayerOps
- Ces prompts facilitent grandement la migration d'applications existantes vers LayerOps

## Structure du projet

```
server-layerops/
├── src/
│   ├── api/           # Client API LayerOps
│   ├── auth/          # Gestion de l'authentification
│   ├── resources/      # Ressources MCP (documentation)
│   ├── tools/          # Tools MCP (actions API)
│   ├── prompts/        # Prompts pour la gestion
│   ├── types/          # Types TypeScript
│   └── index.ts        # Point d'entrée du serveur MCP
├── documentation/
│   ├── features/       # Documentation des fonctionnalités
│   ├── prompts.md      # Documentation des prompts
│   └── MCP_INSPECTOR.md # Guide MCP Inspector
└── package.json
```

## Tools MCP disponibles

Le serveur expose plus de 30 tools MCP pour gérer votre infrastructure :

### Projets
- `layerops_list_projects`
- `layerops_get_project`
- `layerops_create_project`
- `layerops_delete_project`

### Environnements
- `layerops_list_environments`
- `layerops_get_environment`
- `layerops_create_environment`
- `layerops_delete_environment`

### Instances
- `layerops_list_instances`
- `layerops_get_instance`
- `layerops_create_instance`
- `layerops_update_instance`
- `layerops_delete_instance`
- `layerops_start_instance`
- `layerops_stop_instance`
- `layerops_restart_instance`

### Pools d'instances
- `layerops_list_instance_pools`
- `layerops_get_instance_pool`
- `layerops_create_instance_pool`
- `layerops_update_instance_pool`
- `layerops_delete_instance_pool`

### Services
- `layerops_list_services`
- `layerops_get_service`
- `layerops_create_service`
- `layerops_update_service`
- `layerops_delete_service`
- `layerops_scale_service`

### Événements
- `layerops_list_events`
- `layerops_get_event`

### Monitoring
- `layerops_get_instance_monitoring`
- `layerops_get_service_monitoring`

### Analytics
- `layerops_get_analytics`

### RBAC
- `layerops_list_roles`
- `layerops_get_role`
- `layerops_assign_role`

## Ressources MCP disponibles

Le serveur expose 18 ressources de documentation LayerOps :

### Documentation générale
- `layerops://docs/introduction` - Introduction à LayerOps
- `layerops://docs/api/introduction` - Introduction à l'API LayerOps
- `layerops://docs/examples` - Exemples d'applications

### Gestion des ressources
- `layerops://docs/projects` - Gestion des projets
- `layerops://docs/environments` - Gestion des environnements
- `layerops://docs/instances` - Gestion des instances
- `layerops://docs/pools` - Pools d'instances avec autoscaling
- `layerops://docs/services` - Gestion des services
- `layerops://docs/marketplace` - Marketplace LayerOps

### Sécurité
- `layerops://docs/security/api-keys` - Clés API
- `layerops://docs/security/platform-access` - Accès aux plateformes cloud
- `layerops://docs/security/git-repositories` - Dépôts Git
- `layerops://docs/security/docker-registries` - Registres Docker
- `layerops://docs/security/s3-buckets` - Buckets S3

### Monitoring et analytics
- `layerops://docs/monitoring` - Monitoring et surveillance
- `layerops://docs/events` - Événements et audit trail
- `layerops://docs/analytics` - Analytics et coûts

### Fonctionnalités avancées
- `layerops://docs/rbac` - Contrôle d'accès basé sur les rôles
- `layerops://docs/external-hosts` - Connexion d'hôtes externes
- `layerops://docs/multi-providers` - Multi-fournisseurs cloud

## Exemple d'utilisation

### Via un client MCP

Le serveur peut être utilisé avec n'importe quel client MCP compatible. Voici un exemple de configuration :

```json
{
  "mcpServers": {
    "layerops": {
      "command": "node",
      "args": ["/path/to/server-layerops/dist/index.js"],
      "env": {
        "LAYEROPS_API_KEY_ID": "your-key-id",
        "LAYEROPS_API_KEY_SECRET": "your-api-key-secret"
      }
    }
  }
}
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT

