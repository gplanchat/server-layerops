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
  {
    uri: 'layerops://docs/projects',
    name: 'Gestion des projets',
    description: 'Documentation sur la gestion et l\'organisation des projets',
    mimeType: 'text/markdown',
    content: `# Gestion des projets

Les projets sont le conteneur principal qui regroupe vos environnements, instances et services dans LayerOps.

## Création d'un projet

Un projet permet d'organiser et d'isoler vos ressources. Chaque projet peut contenir plusieurs environnements.

## Structure

- **Projet** : Conteneur principal
  - **Environnements** : Isolation des ressources (dev, staging, prod)
    - **Instances** : Serveurs virtuels ou bare metal
    - **Services** : Applications déployées
    - **Pools d'instances** : Groupes d'instances avec autoscaling

## Permissions

Les permissions peuvent être définies au niveau projet pour contrôler l'accès à toutes les ressources du projet.

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/security/platform-access',
    name: 'Accès à la plateforme',
    description: 'Documentation sur la configuration de l\'accès aux plateformes cloud',
    mimeType: 'text/markdown',
    content: `# Accès à la plateforme

LayerOps nécessite des identifiants d'accès pour se connecter aux plateformes cloud (AWS, GCP, OVH, Scaleway, etc.).

## Configuration par fournisseur

### AWS
- Utilisez des credentials IAM avec les permissions appropriées
- Configurez les régions accessibles
- Gestion des rôles IAM

### GCP
- Utilisez un compte de service avec les permissions nécessaires
- Configuration des projets GCP
- Gestion des zones

### OVH Cloud
- Utilisez vos identifiants OVH
- Configuration des régions OVH

### Scaleway
- Utilisez vos clés API Scaleway
- Configuration des zones

### Exoscale
- Utilisez vos identifiants Exoscale
- Configuration des zones

### Infomaniak
- Utilisez vos identifiants Infomaniak
- Configuration des régions

## Sécurité

- Ne partagez jamais vos credentials
- Utilisez des comptes dédiés avec permissions minimales
- Activez la rotation régulière des credentials
- Utilisez des rôles IAM/service accounts plutôt que des clés root

Pour plus d'informations : https://doc.layerops.io/security/platform-access/
`,
  },
  {
    uri: 'layerops://docs/security/git-repositories',
    name: 'Dépôts Git',
    description: 'Documentation sur l\'intégration des dépôts Git',
    mimeType: 'text/markdown',
    content: `# Intégration des dépôts Git

LayerOps peut s'intégrer avec vos dépôts Git pour le déploiement continu et la gestion du code source.

## Dépôts supportés

- GitHub
- GitLab
- Bitbucket
- Dépôts Git privés

## Configuration

1. Connectez votre compte Git à LayerOps
2. Autorisez l'accès aux dépôts nécessaires
3. Configurez les webhooks pour le déploiement automatique

## Utilisation

- Déploiement automatique depuis Git
- Gestion des branches (main, develop, etc.)
- Intégration avec CI/CD
- Gestion des secrets et variables d'environnement

## Sécurité

- Utilisez des tokens d'accès personnels (PAT) avec permissions limitées
- Configurez des webhooks sécurisés
- Limitez l'accès aux dépôts nécessaires uniquement

Pour plus d'informations : https://doc.layerops.io/security/git-repositories/
`,
  },
  {
    uri: 'layerops://docs/security/docker-registries',
    name: 'Registres Docker',
    description: 'Documentation sur la configuration des registres Docker',
    mimeType: 'text/markdown',
    content: `# Registres Docker

LayerOps peut se connecter à vos registres Docker privés pour déployer des images personnalisées.

## Registres supportés

- Docker Hub (public et privé)
- GitHub Container Registry (GHCR)
- GitLab Container Registry
- Amazon ECR
- Google Container Registry (GCR)
- Azure Container Registry (ACR)
- Registres Docker privés personnalisés

## Configuration

1. Ajoutez vos credentials de registre dans LayerOps
2. Configurez l'URL du registre
3. Testez la connexion

## Utilisation

- Déploiement d'images privées
- Pull automatique des images
- Gestion des tags et versions
- Cache des images

## Sécurité

- Utilisez des tokens d'accès avec permissions limitées
- Ne stockez jamais les credentials en clair
- Activez la rotation régulière des tokens
- Limitez l'accès aux images nécessaires uniquement

Pour plus d'informations : https://doc.layerops.io/security/docker-registries/
`,
  },
  {
    uri: 'layerops://docs/security/s3-buckets',
    name: 'Buckets S3',
    description: 'Documentation sur la configuration des buckets S3',
    mimeType: 'text/markdown',
    content: `# Buckets S3

LayerOps peut s'intégrer avec des buckets S3 pour le stockage et le déploiement d'assets.

## Fournisseurs supportés

- Amazon S3
- Compatible S3 (MinIO, DigitalOcean Spaces, etc.)

## Configuration

1. Configurez les credentials AWS S3
2. Spécifiez le bucket et la région
3. Configurez les permissions d'accès

## Utilisation

- Stockage d'assets statiques
- Backups et sauvegardes
- Déploiement de fichiers de configuration
- Stockage de logs

## Permissions

- Lecture seule : pour récupérer des assets
- Écriture : pour uploader des fichiers
- Suppression : pour nettoyer les anciens fichiers

## Sécurité

- Utilisez des credentials IAM avec permissions minimales
- Configurez des politiques de bucket appropriées
- Activez le chiffrement des données
- Limitez l'accès aux buckets nécessaires uniquement

Pour plus d'informations : https://doc.layerops.io/security/s3-buckets/
`,
  },
  {
    uri: 'layerops://docs/pools',
    name: 'Pools d\'instances',
    description: 'Documentation sur la gestion des pools d\'instances avec autoscaling',
    mimeType: 'text/markdown',
    content: `# Pools d'instances

Les pools d'instances permettent de gérer un groupe d'instances avec autoscaling automatique basé sur la charge.

## Création d'un pool

Un pool d'instances peut être configuré avec :
- Type d'instance (CPU, RAM, disque)
- Nombre minimum d'instances
- Nombre maximum d'instances
- Métriques de déclenchement (CPU, mémoire, charge réseau)
- Région

## Autoscaling

L'autoscaling ajuste automatiquement le nombre d'instances selon :
- Utilisation CPU
- Utilisation mémoire
- Charge réseau
- Métriques personnalisées

## Remplacement automatique

Les instances défaillantes sont automatiquement remplacées pour assurer la haute disponibilité.

## Configuration

- Seuils de scale-up et scale-down
- Période de cooldown
- Politique de remplacement
- Distribution géographique

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/events',
    name: 'Événements',
    description: 'Documentation sur le suivi des événements d\'infrastructure',
    mimeType: 'text/markdown',
    content: `# Événements LayerOps

Les événements fournissent un audit trail complet de toutes les actions effectuées sur votre infrastructure.

## Types d'événements

- **Création** : Création de ressources (instances, services, etc.)
- **Modification** : Mise à jour de ressources
- **Suppression** : Suppression de ressources
- **Démarrage/Arrêt** : Changements d'état des instances
- **Déploiement** : Déploiement de services
- **Alertes** : Alertes de monitoring
- **Erreurs** : Erreurs et échecs

## Filtrage

Les événements peuvent être filtrés par :
- Type de ressource (instance, service, environnement, etc.)
- ID de ressource spécifique
- Type d'événement
- Sévérité (info, warning, error)
- Période (date de début/fin)

## Sévérité

- **Info** : Informations générales
- **Warning** : Avertissements
- **Error** : Erreurs nécessitant une attention

## Utilisation

- Audit et conformité
- Diagnostic de problèmes
- Suivi des changements
- Analyse des tendances

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/analytics',
    name: 'Analytics',
    description: 'Documentation sur l\'analyse des performances et des coûts',
    mimeType: 'text/markdown',
    content: `# Analytics LayerOps

Les analytics fournissent des insights détaillés sur les performances, les coûts et l'utilisation de votre infrastructure.

## Métriques disponibles

### Performance
- Utilisation CPU par ressource
- Utilisation mémoire par ressource
- Utilisation disque par ressource
- Trafic réseau (entrée/sortie)
- Latence des services
- Taux d'erreur

### Coûts
- Coûts par ressource
- Coûts par environnement
- Coûts par région
- Évolution des coûts dans le temps
- Prévisions de coûts

### Utilisation
- Nombre d'instances actives
- Nombre de services déployés
- Utilisation des ressources
- Taux d'utilisation

## Analyses

- Comparaison entre environnements
- Tendances temporelles
- Identification des ressources sous-utilisées
- Identification des ressources sur-utilisées
- Recommandations d'optimisation

## Rapports

- Rapports quotidiens, hebdomadaires, mensuels
- Export des données
- Dashboards personnalisés
- Alertes de coûts

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/examples',
    name: 'Exemples d\'applications',
    description: 'Documentation avec des exemples pratiques d\'utilisation',
    mimeType: 'text/markdown',
    content: `# Exemples d'applications LayerOps

Cette section contient des exemples pratiques pour intégrer LayerOps dans vos applications.

## Cas d'usage

### Déploiement d'une application web
- Configuration d'un environnement de production
- Déploiement d'un service frontend et backend
- Configuration du monitoring
- Mise en place de l'autoscaling

### Infrastructure multi-environnements
- Configuration dev/staging/prod
- Gestion des secrets par environnement
- Déploiement automatisé
- Tests de charge

### Migration depuis Kubernetes
- Conversion de Deployments
- Migration des ConfigMaps et Secrets
- Adaptation des Services
- Gestion des volumes

### Migration depuis Docker Compose
- Conversion du fichier docker-compose.yml
- Déploiement des services
- Configuration des dépendances
- Gestion des variables d'environnement

## Intégrations

- CI/CD avec GitHub Actions
- Intégration avec GitLab CI
- Déploiement depuis Jenkins
- Webhooks personnalisés

## Bonnes pratiques

- Organisation des projets et environnements
- Gestion des secrets
- Configuration du monitoring
- Optimisation des coûts
- Sécurité et RBAC

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/marketplace',
    name: 'Marketplace',
    description: 'Documentation sur la marketplace LayerOps',
    mimeType: 'text/markdown',
    content: `# Marketplace LayerOps

La marketplace LayerOps propose des services pré-configurés prêts à l'emploi.

## Services disponibles

La marketplace contient des services populaires :
- Bases de données (PostgreSQL, MySQL, MongoDB, Redis, etc.)
- Serveurs web (Nginx, Apache, Caddy, etc.)
- Outils de monitoring (Prometheus, Grafana, etc.)
- Outils de développement (GitLab, Jenkins, etc.)
- Et bien plus...

## Déploiement depuis la marketplace

1. Parcourez la marketplace
2. Sélectionnez le service souhaité
3. Configurez les paramètres (ports, variables d'environnement, etc.)
4. Déployez dans votre environnement

## Avantages

- Configuration pré-optimisée
- Mise à jour automatique
- Support intégré
- Documentation complète

## Services personnalisés

Vous pouvez également déployer vos propres images Docker depuis :
- Docker Hub
- Registres privés
- Images personnalisées

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/external-hosts',
    name: 'Hôtes externes',
    description: 'Documentation sur la connexion d\'hôtes externes',
    mimeType: 'text/markdown',
    content: `# Hôtes externes

LayerOps permet de connecter n'importe quel hôte externe et de l'utiliser comme n'importe quel autre dans votre environnement.

## Connexion d'un hôte externe

Vous pouvez connecter :
- Serveurs existants (cloud ou on-premise)
- Machines virtuelles
- Serveurs bare metal
- Clusters Kubernetes existants

## Configuration

1. Installez l'agent LayerOps sur l'hôte externe
2. Configurez la connexion sécurisée
3. L'hôte apparaît dans votre environnement LayerOps

## Utilisation

Une fois connecté, un hôte externe peut être utilisé comme :
- Instance LayerOps standard
- Cible de déploiement de services
- Partie d'un pool d'instances
- Ressource surveillée par le monitoring

## Avantages

- Migration progressive vers LayerOps
- Utilisation de l'infrastructure existante
- Flexibilité dans le choix des fournisseurs
- Gestion unifiée de l'infrastructure hybride

## Sécurité

- Connexion sécurisée via TLS
- Authentification par clés
- Isolation réseau
- Audit des accès

Pour plus d'informations : https://doc.layerops.io/
`,
  },
  {
    uri: 'layerops://docs/multi-providers',
    name: 'Multi-fournisseurs',
    description: 'Documentation sur l\'utilisation de plusieurs fournisseurs cloud',
    mimeType: 'text/markdown',
    content: `# Multi-fournisseurs

LayerOps permet d'utiliser plusieurs fournisseurs cloud (AWS, GCP, Outscale, etc.) et plusieurs régions simultanément.

## Fournisseurs supportés

- Amazon Web Services (AWS)
- Google Cloud Platform (GCP)
- Outscale
- OVH Cloud
- Scaleway
- Exoscale
- Infomaniak
- Et bien plus...

## Configuration

1. Configurez l'accès à chaque fournisseur cloud
2. Sélectionnez les régions disponibles
3. Utilisez les ressources de n'importe quel fournisseur

## Avantages

- Éviter le vendor lock-in
- Optimiser les coûts en choisissant le meilleur fournisseur
- Réduire les risques de panne (multi-cloud)
- Utiliser les meilleures fonctionnalités de chaque fournisseur

## Utilisation

- Déployer des instances sur différents fournisseurs
- Répartir la charge entre plusieurs régions
- Configurer la haute disponibilité multi-cloud
- Optimiser les coûts en comparant les tarifs

## Gestion unifiée

Tous les fournisseurs sont gérés depuis une interface unique :
- Monitoring unifié
- Analytics consolidés
- Gestion des coûts centralisée
- RBAC unifié

Pour plus d'informations : https://doc.layerops.io/
`,
  },
];

