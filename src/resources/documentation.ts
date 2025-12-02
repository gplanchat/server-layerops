/**
 * Ressources MCP pour la documentation LayerOps
 */

export const DOCUMENTATION_RESOURCES = [
  {
    uri: 'layerops://docs/introduction',
    name: 'Introduction à LayerOps',
    description: 'Documentation d\'introduction à LayerOps',
    mimeType: 'text/markdown',
    content: `# Introduction à LayerOps

LayerOps est une plateforme de gestion avancée du cloud hybride qui permet de déployer, mettre à l'échelle, surveiller et contrôler les coûts de votre infrastructure.

## Fonctionnalités principales

- **Instances** : Gestion d'instances cloud hybrides et bare metal avec autoscaling et remplacement automatique
- **Services** : Déploiement facile de services depuis la marketplace ou des images Docker personnalisées
- **RBAC** : Contrôle d'accès basé sur les rôles pour définir les droits sur chaque environnement et ressource
- **Monitoring** : Surveillance automatique installée pour suivre l'état de vos hôtes et les logs de vos applications
- **Événements** : Suivi de tous les événements d'infrastructure et de service avec un audit trail complet
- **Multi Providers** : Utilisation de plusieurs fournisseurs (AWS, GCP, Outscale) et plusieurs régions simultanément
- **External Host** : Connexion de n'importe quel hôte et utilisation comme n'importe quel autre dans votre environnement
- **Analytics** : Surveillance des performances, analyse des coûts et insights sur l'utilisation de votre infrastructure

## Documentation

Pour plus d'informations, consultez : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/api/introduction',
    name: 'Introduction à l\'API LayerOps',
    description: 'Documentation de l\'API LayerOps',
    mimeType: 'text/markdown',
    content: `# Introduction à l'API LayerOps

L'API LayerOps permet d'interagir programmatiquement avec la plateforme pour gérer votre infrastructure.

## Authentification

Les appels API nécessitent l'en-tête \`X-API-KEY\` au format :
\`\`\`
X-API-KEY: <Key ID>:<API Key secret>
\`\`\`

## Base URL

\`https://api.layerops.io\`

## Endpoints principaux

- \`/projects\` - Gestion des projets
- \`/environments\` - Gestion des environnements
- \`/instances\` - Gestion des instances
- \`/pools\` - Gestion des pools d'instances
- \`/services\` - Gestion des services
- \`/events\` - Consultation des événements
- \`/monitoring\` - Données de monitoring
- \`/analytics\` - Analytics et coûts
- \`/rbac\` - Gestion des rôles et permissions

Pour plus d'informations : https://doc.layerops.io/api/introduction/
`,
  },
  {
    uri: 'layerops://docs/security/api-keys',
    name: 'Clés API',
    description: 'Documentation sur la création et l\'utilisation des clés API',
    mimeType: 'text/markdown',
    content: `# Clés API LayerOps

Les clés API permettent d'authentifier les requêtes vers l'API LayerOps.

## Création d'une clé API

1. Connectez-vous à votre compte LayerOps
2. Accédez aux paramètres de sécurité
3. Créez une nouvelle clé API
4. Notez le Key ID et le secret (qui ne sera affiché qu'une seule fois)

## Utilisation

Incluez la clé API dans l'en-tête de chaque requête :
\`\`\`
X-API-KEY: <Key ID>:<API Key secret>
\`\`\`

## Sécurité

- Ne partagez jamais vos clés API
- Régénérez régulièrement vos clés
- Utilisez des clés différentes pour chaque environnement

Pour plus d'informations : https://doc.layerops.io/security/api-keys/
`,
  },
  {
    uri: 'layerops://docs/instances',
    name: 'Gestion des instances',
    description: 'Documentation sur la gestion des instances',
    mimeType: 'text/markdown',
    content: `# Gestion des instances

Les instances sont les serveurs virtuels ou bare metal déployés sur LayerOps.

## Création d'une instance

Une instance peut être créée avec les paramètres suivants :
- Nom de l'instance
- Type d'instance (CPU, RAM, disque)
- Région
- Image (OS)
- Environnement

## Autoscaling

Les instances peuvent être configurées pour s'adapter automatiquement à la charge :
- Nombre minimum d'instances
- Nombre maximum d'instances
- Métriques de déclenchement

## Remplacement automatique

Les instances défaillantes peuvent être remplacées automatiquement pour assurer la haute disponibilité.

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/services',
    name: 'Gestion des services',
    description: 'Documentation sur le déploiement et la gestion des services',
    mimeType: 'text/markdown',
    content: `# Gestion des services

Les services sont des applications déployées sur LayerOps, soit depuis la marketplace, soit depuis des images Docker personnalisées.

## Déploiement depuis la marketplace

LayerOps propose une marketplace avec des services pré-configurés prêts à l'emploi.

## Déploiement depuis Docker

Vous pouvez déployer n'importe quelle image Docker :
- Images publiques depuis Docker Hub
- Images privées depuis vos registres Docker
- Images personnalisées

## Configuration

- Ports exposés
- Variables d'environnement
- Ressources (CPU, RAM)
- Nombre de répliques

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/monitoring',
    name: 'Monitoring',
    description: 'Documentation sur le monitoring et la surveillance',
    mimeType: 'text/markdown',
    content: `# Monitoring LayerOps

Le monitoring est automatiquement installé pour toutes vos instances et services.

## Métriques disponibles

- CPU
- Mémoire
- Disque
- Réseau (entrée/sortie)
- Logs d'application

## Grafana

LayerOps intègre Grafana pour visualiser vos métriques et créer des dashboards personnalisés.

## Alertes

Configurez des alertes basées sur des seuils de métriques pour être notifié en cas de problème.

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/rbac',
    name: 'RBAC - Contrôle d\'accès basé sur les rôles',
    description: 'Documentation sur le RBAC',
    mimeType: 'text/markdown',
    content: `# RBAC - Contrôle d'accès basé sur les rôles

Le RBAC permet de définir précisément les droits d'accès pour chaque utilisateur sur chaque ressource.

## Concepts

- **Rôles** : Définissent un ensemble de permissions
- **Assignations** : Lient un utilisateur à un rôle sur une ressource spécifique
- **Ressources** : Projets, environnements, instances, services, etc.

## Permissions

Les permissions peuvent être définies au niveau :
- Projet
- Environnement
- Instance
- Service

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/environments',
    name: 'Gestion des environnements',
    description: 'Documentation sur la gestion des environnements',
    mimeType: 'text/markdown',
    content: `# Gestion des environnements

Les environnements permettent d'isoler vos ressources et services.

## Utilisation

- **Développement** : Environnement de test
- **Staging** : Environnement de pré-production
- **Production** : Environnement de production

## Isolation

Chaque environnement est isolé :
- Réseau
- Ressources
- Services
- Permissions

Pour plus d'informations : https://doc.layerops.io/
`,
  },
];

