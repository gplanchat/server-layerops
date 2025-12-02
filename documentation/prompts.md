# Prompts pour la gestion de l'infrastructure LayerOps

Ce document décrit les prompts disponibles pour gérer votre infrastructure LayerOps via le serveur MCP. Ces prompts sont conçus pour être utilisés par des agents LLM et contiennent des instructions détaillées, des séquences d'actions, et des exemples concrets.

## Prompts disponibles

### 1. Création d'infrastructure complète

**Prompt**: `layerops-create-infrastructure`

Crée une infrastructure complète sur LayerOps incluant un projet, un environnement, et optionnellement des instances et services. Ce prompt guide l'agent LLM à travers toutes les étapes nécessaires avec validation et gestion d'erreurs.

**Instructions détaillées** :
1. Vérifier si le projet existe déjà
2. Créer le projet si nécessaire
3. Créer l'environnement dans le projet
4. Créer les instances une par une avec validation
5. Déployer les services avec configuration complète
6. Vérifier l'état final de toutes les ressources

**Arguments**:
- `projectName` (requis) : Nom unique du projet à créer
- `environmentName` (requis) : Nom de l'environnement (ex: "production", "staging", "development")
- `instances` (optionnel) : Tableau d'objets avec `name`, `instanceType`, `region`, et optionnellement `image`
- `services` (optionnel) : Tableau d'objets avec `name`, `image`, et optionnellement `ports`, `env`, `replicas`

**Exemple d'utilisation**:
```
Je veux créer une infrastructure complète :
- Projet : "Mon Application"
- Environnement : "production"
- Instances : [
    {name: "web-1", instanceType: "t2.medium", region: "eu-west-1"},
    {name: "web-2", instanceType: "t2.medium", region: "eu-west-1"}
  ]
- Services : [
    {name: "api", image: "nginx:latest", replicas: 3, ports: [{containerPort: 80}]}
  ]
```

**Gestion des erreurs** :
- Si le projet existe déjà, récupérer son ID et continuer
- Valider chaque étape avant de passer à la suivante
- Retourner des messages d'erreur clairs en cas de problème

### 2. Déploiement de service

**Prompt**: `layerops-deploy-service`

Déploie un service sur LayerOps avec une configuration complète incluant ports, variables d'environnement et répliques. Le prompt guide l'agent à travers la validation, la vérification des conflits, et la configuration complète.

**Instructions détaillées** :
1. Vérifier que l'environnement existe
2. Vérifier si un service avec le même nom existe déjà
3. Préparer et valider tous les paramètres
4. Créer le service avec la configuration complète
5. Vérifier l'état du service après déploiement

**Arguments**:
- `serviceName` (requis) : Nom unique du service dans l'environnement
- `image` (requis) : Image Docker complète (ex: "nginx:latest", "myregistry/api:v1.0")
- `environmentId` (requis) : ID de l'environnement cible (format: "env-xxx")
- `ports` (optionnel) : Ports à exposer (format string: "80:8080" ou array: [{containerPort: 80, hostPort: 8080}])
- `env` (optionnel) : Variables d'environnement (format object: {KEY: "value"} ou string: "KEY=value,KEY2=value2")
- `replicas` (optionnel) : Nombre de répliques (minimum: 1, défaut: 1)

**Exemple d'utilisation**:
```
Je veux déployer un service :
- Nom : "api-backend"
- Image : "myregistry/api:latest"
- Environnement : env-123
- Ports : [{containerPort: 8080, hostPort: 80}]
- Variables d'environnement : {NODE_ENV: "production", API_KEY: "secret"}
- Répliques : 5
```

**Validations** :
- Vérifier que l'image Docker est dans un format valide
- Vérifier que les ports sont des nombres valides
- Vérifier que replicas >= 1
- Vérifier que l'environnement existe avant création

### 3. Mise à l'échelle d'infrastructure

**Prompt**: `layerops-scale-infrastructure`

Met à l'échelle une infrastructure complète (instances et services) dans un environnement donné. Supporte trois modes : augmentation manuelle, réduction manuelle, et ajustement automatique basé sur les métriques.

**Instructions détaillées** :
1. Vérifier que l'environnement existe
2. Analyser l'état actuel (instances et services)
3. Selon le scaleType :
   - "up" : Augmenter les ressources
   - "down" : Réduire les ressources (minimum: 1)
   - "auto" : Analyser les métriques et ajuster automatiquement
4. Appliquer les changements dans l'ordre
5. Générer un rapport final avec état avant/après

**Arguments**:
- `environmentId` (requis) : ID de l'environnement à mettre à l'échelle
- `scaleType` (requis) : "up" (augmenter), "down" (réduire), ou "auto" (ajustement automatique)
- `targetInstances` (optionnel) : Nombre cible d'instances
- `targetReplicas` (optionnel) : Nombre cible de répliques par service
- `metricsThreshold` (optionnel) : Seuils pour mode "auto" : {cpuHigh: 80, cpuLow: 20, memoryHigh: 85, memoryLow: 30}

**Exemple d'utilisation**:
```
Je veux mettre à l'échelle mon environnement env-123 :
- Type : "up"
- Instances cibles : 5
- Répliques cibles : 10
```

**Validations** :
- Vérifier que l'environnement existe
- Pour "down" : s'assurer qu'on ne descend pas en dessous de 1
- Pour "auto" : vérifier que les métriques sont disponibles

### 4. Surveillance d'infrastructure

**Prompt**: `layerops-monitor-infrastructure`

Surveille l'infrastructure LayerOps et génère un rapport de santé détaillé incluant métriques, événements et alertes. Peut surveiller un environnement spécifique ou toute l'infrastructure.

**Instructions détaillées** :
1. Récupérer les ressources (instances et services)
2. Pour chaque instance : récupérer métriques (CPU, mémoire, disque, réseau) et événements
3. Pour chaque service : récupérer métriques et état des répliques
4. Analyser les événements globaux pour détecter les alertes
5. Générer un rapport structuré avec indicateurs de santé

**Arguments**:
- `environmentId` (optionnel) : ID de l'environnement à surveiller. Si non fourni, surveiller toute l'infrastructure
- `includeServices` (optionnel, défaut: true) : Inclure les services dans le monitoring
- `timeRange` (optionnel) : Période d'analyse ("1h", "24h", "7d" ou format ISO 8601)
- `alertThresholds` (optionnel) : Seuils d'alerte personnalisés : {cpu: 80, memory: 85, disk: 90}

**Exemple d'utilisation**:
```
Génère un rapport de santé pour l'environnement env-123
- Inclure les métriques des services
- Période : dernières 24 heures
- Seuils d'alerte : CPU > 80%, Mémoire > 85%
```

**Rapport généré** :
- Résumé exécutif (état global, alertes critiques)
- Métriques par instance et service
- Événements récents et alertes
- Recommandations basées sur les métriques
- Indicateurs de santé (vert/jaune/rouge)

### 5. Analyse des coûts

**Prompt**: `layerops-analyze-costs`

Analyse les coûts de l'infrastructure LayerOps et fournit des recommandations détaillées d'optimisation avec estimation d'économies potentielles.

**Instructions détaillées** :
1. Récupérer les analytics pour la période demandée
2. Analyser les coûts par type de ressource et par environnement
3. Corréler les coûts avec l'utilisation réelle (métriques)
4. Identifier les opportunités d'optimisation
5. Générer un rapport avec recommandations prioritaires

**Arguments**:
- `environmentId` (optionnel) : ID de l'environnement à analyser. Si non fourni, analyse globale
- `period` (optionnel, défaut: "last-month") : "last-week", "last-month", "last-quarter", "last-year", ou "custom"
- `startTime` (optionnel) : Date de début ISO 8601 (requis si period="custom")
- `endTime` (optionnel) : Date de fin ISO 8601 (requis si period="custom")
- `includeRecommendations` (optionnel, défaut: true) : Inclure les recommandations d'optimisation
- `costThreshold` (optionnel) : Seuil de coût pour alerter (ex: 1000)

**Exemple d'utilisation**:
```
Analyse les coûts du dernier mois pour l'environnement env-123
- Inclure les recommandations d'optimisation
- Alerter si coût > 1000€
```

**Rapport généré** :
- Résumé exécutif (coût total, évolution, tendances)
- Répartition des coûts (par type, environnement, région)
- Top 10 des ressources les plus coûteuses
- Opportunités d'optimisation avec estimation d'économies
- Plan d'action suggéré par priorité

### 6. Diagnostic de problèmes

**Prompt**: `layerops-troubleshoot`

Diagnostique les problèmes d'infrastructure LayerOps en analysant les événements, métriques et logs pour identifier la cause racine et proposer des solutions.

**Instructions détaillées** :
1. Identifier les ressources à diagnostiquer (spécifique ou toutes)
2. Pour chaque ressource : récupérer événements et métriques récentes
3. Analyser les corrélations entre événements et métriques
4. Identifier les causes probables
5. Générer un rapport avec recommandations de résolution

**Arguments**:
- `resourceType` (optionnel) : "instance", "service", "environment", ou "all"
- `resourceId` (optionnel) : ID de la ressource spécifique (format: "inst-xxx", "svc-xxx", "env-xxx")
- `timeRange` (optionnel) : Période d'analyse ("1h", "24h", "7d" ou format ISO 8601)
- `severity` (optionnel) : Filtrer par sévérité : "error", "warning", "info", ou "all"
- `includeMetrics` (optionnel, défaut: true) : Inclure l'analyse des métriques

**Exemple d'utilisation**:
```
Diagnostique les problèmes de l'instance inst-123
- Période : dernières 24 heures
- Inclure uniquement les erreurs et avertissements
- Analyser les métriques pour corrélation
```

**Rapport généré** :
- Résumé exécutif (problèmes identifiés, sévérité)
- Détails par ressource (état, événements, métriques)
- Analyse des causes probables
- Recommandations de résolution par priorité
- Actions suggérées avec séquence d'exécution
- Prévention (comment éviter le problème à l'avenir)

## Utilisation avec les tools MCP

Ces prompts peuvent être utilisés en combinaison avec les tools MCP disponibles. Par exemple, pour créer une infrastructure complète, le prompt peut utiliser :

1. `layerops_create_project` - Créer le projet
2. `layerops_create_environment` - Créer l'environnement
3. `layerops_create_instance` - Créer les instances
4. `layerops_create_service` - Déployer les services

### 7. Conversion Docker Compose vers LayerOps

**Prompt**: `layerops-convert-docker-compose`

Convertit un fichier Docker Compose en spécification LayerOps et peut déployer l'infrastructure correspondante. Ce prompt facilite la migration d'applications existantes vers LayerOps.

**Instructions détaillées** :
1. Parser et valider le fichier Docker Compose (YAML)
2. Extraire tous les services avec leurs configurations
3. Analyser les dépendances entre services (depends_on)
4. Convertir chaque service :
   - Image Docker → image LayerOps
   - Ports Docker → format LayerOps
   - Variables d'environnement → format LayerOps
   - Noter les limitations (volumes, networks, etc.)
5. Créer un plan de migration avec ordre de déploiement
6. Si déploiement demandé : déployer chaque service dans l'ordre
7. Générer un rapport de conversion complet

**Arguments**:
- `dockerComposeFile` (requis) : Contenu du fichier docker-compose.yml (YAML) ou chemin vers le fichier
- `projectName` (optionnel) : Nom du projet LayerOps. Si fourni avec environmentId, déploie l'infrastructure
- `environmentId` (optionnel) : ID de l'environnement LayerOps. Si fourni avec projectName, déploie l'infrastructure
- `outputFormat` (optionnel, défaut: "spec") : "spec" (spécification uniquement), "deploy" (déployer), ou "both"
- `servicePrefix` (optionnel) : Préfixe pour les noms de services (ex: "prod-")
- `portMapping` (optionnel) : Mappings personnalisés de ports : {serviceName: {containerPort: hostPort}}
- `envFile` (optionnel) : Contenu du fichier .env pour résoudre les variables

**Conversions supportées** :
- **Ports** : "8080:80" → [{containerPort: 80, hostPort: 8080}]
- **Variables d'environnement** : KEY=value → {KEY: "value"}
- **Dépendances** : depends_on → ordre de déploiement et configuration des URLs
- **Images** : repository:tag → image LayerOps

**Limitations** :
- Volumes : LayerOps gère le stockage différemment, nécessite documentation
- Networks personnalisés : LayerOps utilise son propre réseau
- Build context : Nécessite une image pré-construite
- Command/Entrypoint : Noté pour référence

**Exemple d'utilisation**:
```
Convertit mon docker-compose.yml vers LayerOps :
- Fichier : [contenu du docker-compose.yml]
- Projet : "MonApp"
- Environnement : env-123
- Format : "both" (spécification + déploiement)
- Préfixe : "prod-"
```

**Exemple de fichier Docker Compose** :
```yaml
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    environment:
      - API_URL=http://api
    depends_on:
      - api
  
  api:
    image: myapp/api:v1.0
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

**Rapport généré** :
- Résumé des services convertis
- Mappings Docker Compose → LayerOps
- Ordre de déploiement recommandé
- Limitations et différences
- Instructions pour éléments non supportés
- Plan de déploiement si applicable

### 8. Conversion Helm vers LayerOps

**Prompt**: `layerops-convert-helm`

Convertit un chart Helm en spécification LayerOps et peut déployer l'infrastructure correspondante. Ce prompt facilite la migration d'applications Kubernetes/Helm vers LayerOps.

**Instructions détaillées** :
1. Analyser la structure du chart Helm (Chart.yaml, values.yaml, templates)
2. Parser les templates Kubernetes (Deployments, Services, ConfigMaps, Secrets)
3. Extraire les ressources principales :
   - Deployments → Services LayerOps
   - Services → Configuration de ports
   - ConfigMaps/Secrets → Variables d'environnement
4. Convertir chaque ressource au format LayerOps
5. Gérer les dépendances et l'ordre de déploiement
6. Remplacer les valeurs Helm ({{ .Values.* }})
7. Si déploiement demandé : déployer chaque service dans l'ordre
8. Générer un rapport de conversion complet

**Arguments**:
- `helmChartPath` (requis) : Chemin vers le dossier du chart Helm ou archive .tgz
- `projectName` (optionnel) : Nom du projet LayerOps. Si fourni avec environmentId, déploie l'infrastructure
- `environmentId` (optionnel) : ID de l'environnement LayerOps. Si fourni avec projectName, déploie l'infrastructure
- `outputFormat` (optionnel, défaut: "spec") : "spec" (spécification uniquement), "deploy" (déployer), ou "both"
- `values` (optionnel) : Valeurs Helm personnalisées : {key: value}
- `servicePrefix` (optionnel) : Préfixe pour les noms de services (ex: "prod-")
- `portMapping` (optionnel) : Mappings personnalisés de ports
- `includeResources` (optionnel) : Types de ressources à inclure : ["deployments", "services", "configmaps", "secrets"]

**Conversions supportées** :
- **Deployments** → Services LayerOps avec image, ports, env, replicas
- **Services Kubernetes** → Configuration de ports LayerOps
- **ConfigMaps** → Variables d'environnement
- **Secrets** → Variables d'environnement sécurisées
- **Valeurs Helm** → Remplacement des placeholders {{ .Values.* }}

**Limitations** :
- PersistentVolumeClaims : LayerOps gère le stockage différemment
- Ingress : LayerOps a son propre système de routage
- StatefulSets : Convertir mais noter les différences
- DaemonSets : Non directement supporté
- Jobs/CronJobs : Nécessite adaptation
- ServiceAccounts : Gestion différente
- NetworkPolicies : LayerOps gère différemment
- HPA : LayerOps a son propre autoscaling
- Resources (CPU/memory) : Gestion différente
- InitContainers/Sidecars : Nécessitent adaptation

**Exemple d'utilisation**:
```
Convertit mon chart Helm vers LayerOps :
- Chart : /path/to/myapp-chart
- Projet : "MonApp"
- Environnement : env-123
- Format : "both" (spécification + déploiement)
- Valeurs personnalisées : {replicaCount: 5, image.tag: "v2.0"}
- Préfixe : "prod-"
```

**Exemple de structure Helm** :
```
myapp-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── configmap.yaml
    └── secret.yaml
```

**Rapport généré** :
- Résumé des ressources converties
- Mappings Kubernetes → LayerOps
- Ordre de déploiement recommandé
- Limitations et différences détaillées
- Instructions pour éléments non supportés
- Plan de déploiement si applicable

## Bonnes pratiques

1. **Toujours vérifier avant de supprimer** : Utilisez `layerops_get_*` pour vérifier les ressources avant suppression
2. **Surveiller après création** : Utilisez `layerops_monitor_*` après avoir créé des ressources
3. **Analyser les coûts régulièrement** : Utilisez `layerops_analyze_costs` pour optimiser les dépenses
4. **Consulter les événements** : Utilisez `layerops_list_events` pour suivre l'historique des actions
5. **Migration Docker Compose** : Utilisez `layerops-convert-docker-compose` pour migrer vos applications existantes
6. **Migration Helm** : Utilisez `layerops-convert-helm` pour migrer vos charts Helm vers LayerOps

