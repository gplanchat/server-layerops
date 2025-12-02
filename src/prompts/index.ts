/**
 * Prompts MCP pour la gestion de l'infrastructure LayerOps
 * 
 * Ces prompts sont conçus pour être utilisés par des agents LLM.
 * Chaque prompt contient des instructions détaillées, des séquences d'actions,
 * et des exemples concrets pour guider l'agent dans l'exécution des tâches.
 */

export const PROMPTS = [
  {
    name: 'layerops-create-infrastructure',
    description: `Crée une infrastructure complète sur LayerOps incluant un projet, un environnement, et optionnellement des instances et services.

INSTRUCTIONS DÉTAILLÉES :
1. Vérifier d'abord si le projet existe déjà en utilisant layerops_list_projects
2. Si le projet n'existe pas, créer le projet avec layerops_create_project
3. Récupérer l'ID du projet créé depuis la réponse
4. Créer l'environnement dans ce projet avec layerops_create_environment
5. Récupérer l'ID de l'environnement créé depuis la réponse
6. Pour chaque instance demandée :
   - Utiliser layerops_create_instance avec les paramètres fournis
   - Inclure l'environmentId récupéré à l'étape précédente
   - Attendre la confirmation de création avant de passer à la suivante
7. Pour chaque service demandé :
   - Utiliser layerops_create_service avec les paramètres fournis
   - Inclure l'environmentId récupéré
   - Configurer les ports si fournis (format: [{containerPort: number, hostPort?: number}])
   - Configurer les variables d'environnement si fournies (format: {key: value})
   - Attendre la confirmation de déploiement
8. Vérifier l'état de toutes les ressources créées
9. Retourner un résumé complet avec tous les IDs créés

FORMAT DES ARGUMENTS :
- projectName: string (requis) - Nom unique du projet
- environmentName: string (requis) - Nom de l'environnement (ex: "production", "staging", "development")
- instances: array (optionnel) - Tableau d'objets avec :
  * name: string - Nom de l'instance
  * instanceType: string - Type (ex: "t2.micro", "t2.medium", "t2.large")
  * region: string - Région (ex: "eu-west-1", "us-east-1")
  * image: string (optionnel) - Image OS (ex: "ubuntu:20.04")
- services: array (optionnel) - Tableau d'objets avec :
  * name: string - Nom du service
  * image: string - Image Docker (ex: "nginx:latest", "myregistry/app:v1.0")
  * ports: array (optionnel) - [{containerPort: number, hostPort?: number}]
  * env: object (optionnel) - Variables d'environnement {key: value}
  * replicas: number (optionnel) - Nombre de répliques (défaut: 1)

GESTION DES ERREURS :
- Si le projet existe déjà, récupérer son ID et continuer
- Si une erreur survient, arrêter le processus et retourner un message d'erreur clair
- Vérifier chaque étape avant de passer à la suivante

EXEMPLE DE SÉQUENCE :
1. layerops_list_projects() → vérifier existence
2. layerops_create_project({name: "MonApp"}) → créer projet
3. layerops_create_environment({name: "production", projectId: "proj-123"}) → créer env
4. layerops_create_instance({name: "web-1", instanceType: "t2.medium", region: "eu-west-1", environmentId: "env-456"}) → créer instance
5. layerops_create_service({name: "api", image: "nginx:latest", environmentId: "env-456", replicas: 3}) → déployer service`,
    arguments: [
      {
        name: 'projectName',
        description: 'Nom unique du projet à créer. Vérifier d\'abord s\'il existe déjà.',
        required: true,
      },
      {
        name: 'environmentName',
        description: 'Nom de l\'environnement à créer dans le projet (ex: production, staging, development)',
        required: true,
      },
      {
        name: 'instances',
        description: 'Tableau d\'objets décrivant les instances à créer. Chaque objet doit contenir: name (string), instanceType (string), region (string), et optionnellement image (string).',
        required: false,
      },
      {
        name: 'services',
        description: 'Tableau d\'objets décrivant les services à déployer. Chaque objet doit contenir: name (string), image (string), et optionnellement ports (array), env (object), replicas (number).',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-deploy-service',
    description: `Déploie un service sur LayerOps avec une configuration complète incluant ports, variables d'environnement et répliques.

INSTRUCTIONS DÉTAILLÉES :
1. Vérifier que l'environnement existe en utilisant layerops_get_environment avec l'environmentId fourni
2. Si l'environnement n'existe pas, retourner une erreur claire
3. Vérifier si un service avec le même nom existe déjà dans l'environnement avec layerops_list_services
4. Si le service existe, décider selon le contexte : soit mettre à jour, soit retourner une erreur
5. Préparer les paramètres pour layerops_create_service :
   - name: le nom du service fourni
   - image: l'image Docker fournie (doit être au format "repository:tag" ou "registry/repository:tag")
   - environmentId: l'ID de l'environnement fourni
   - ports: convertir le format fourni en tableau d'objets [{containerPort: number, hostPort?: number}]
   - env: convertir les variables d'environnement en objet {key: value}
   - replicas: nombre de répliques (défaut: 1 si non spécifié)
6. Appeler layerops_create_service avec tous les paramètres
7. Attendre la confirmation de création
8. Vérifier l'état du service avec layerops_get_service
9. Retourner un résumé avec l'ID du service créé et son état

FORMAT DES ARGUMENTS :
- serviceName: string (requis) - Nom unique du service dans l'environnement
- image: string (requis) - Image Docker complète (ex: "nginx:latest", "myregistry/api:v1.2.3", "ghcr.io/user/app:latest")
- environmentId: string (requis) - ID de l'environnement cible (format: "env-xxx")
- ports: string ou array (optionnel) - 
  * Si string: format "containerPort:hostPort" ou "containerPort" (ex: "80:8080" ou "80")
  * Si array: [{containerPort: number, hostPort?: number}]
- env: object ou string (optionnel) - 
  * Si object: {KEY: "value", KEY2: "value2"}
  * Si string: format "KEY=value,KEY2=value2" à convertir en object
- replicas: number (optionnel) - Nombre de répliques (minimum: 1, défaut: 1)

VALIDATIONS :
- Vérifier que l'image Docker est dans un format valide
- Vérifier que les ports sont des nombres valides
- Vérifier que replicas >= 1
- Vérifier que l'environnement existe avant de créer le service

GESTION DES ERREURS :
- Si l'environnement n'existe pas : retourner erreur avec suggestion de vérifier l'ID
- Si le service existe déjà : proposer de mettre à jour ou utiliser un autre nom
- Si l'image est invalide : retourner erreur avec format attendu
- Si la création échoue : retourner le message d'erreur de l'API

EXEMPLE DE SÉQUENCE :
1. layerops_get_environment({environmentId: "env-123"}) → vérifier environnement
2. layerops_list_services({environmentId: "env-123"}) → vérifier nom disponible
3. layerops_create_service({
     name: "api-backend",
     image: "myregistry/api:v1.0",
     environmentId: "env-123",
     ports: [{containerPort: 8080, hostPort: 80}],
     env: {NODE_ENV: "production", API_KEY: "secret"},
     replicas: 3
   }) → créer service
4. layerops_get_service({serviceId: "svc-456"}) → vérifier état`,
    arguments: [
      {
        name: 'serviceName',
        description: 'Nom unique du service. Vérifier d\'abord s\'il existe déjà dans l\'environnement.',
        required: true,
      },
      {
        name: 'image',
        description: 'Image Docker complète au format "repository:tag" ou "registry/repository:tag" (ex: "nginx:latest", "myregistry/api:v1.0")',
        required: true,
      },
      {
        name: 'environmentId',
        description: 'ID de l\'environnement cible (format: "env-xxx"). Vérifier d\'abord que l\'environnement existe.',
        required: true,
      },
      {
        name: 'ports',
        description: 'Ports à exposer. Format string: "containerPort:hostPort" ou "containerPort". Format array: [{containerPort: number, hostPort?: number}]. Exemple: "80:8080" ou [{containerPort: 80, hostPort: 8080}]',
        required: false,
      },
      {
        name: 'env',
        description: 'Variables d\'environnement. Format object: {KEY: "value"}. Format string: "KEY=value,KEY2=value2" (sera converti en object).',
        required: false,
      },
      {
        name: 'replicas',
        description: 'Nombre de répliques du service (minimum: 1, défaut: 1). Pour haute disponibilité, utiliser au moins 2.',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-scale-infrastructure',
    description: `Met à l'échelle une infrastructure complète (instances et services) dans un environnement donné.

INSTRUCTIONS DÉTAILLÉES :
1. Vérifier que l'environnement existe avec layerops_get_environment
2. Récupérer la liste actuelle des instances avec layerops_list_instances filtrées par environmentId
3. Récupérer la liste actuelle des services avec layerops_list_services filtrées par environmentId
4. Analyser l'état actuel (nombre d'instances, nombre de répliques par service)
5. Selon le scaleType :
   - "up" : Augmenter les ressources
     * Pour les instances : créer de nouvelles instances ou augmenter la taille des pools
     * Pour les services : augmenter le nombre de répliques avec layerops_scale_service
   - "down" : Réduire les ressources
     * Pour les instances : supprimer des instances ou réduire la taille des pools
     * Pour les services : réduire le nombre de répliques (minimum: 1)
   - "auto" : Analyser les métriques et ajuster automatiquement
     * Récupérer les métriques avec layerops_get_instance_monitoring et layerops_get_service_monitoring
     * Analyser CPU, mémoire, charge réseau
     * Ajuster selon les seuils (ex: CPU > 80% → scale up, CPU < 20% → scale down)
6. Pour chaque modification :
   - Appliquer les changements dans l'ordre (instances d'abord, puis services)
   - Attendre la confirmation de chaque action
   - Vérifier l'état après chaque modification
7. Générer un rapport final avec :
   - État avant et après
   - Nombre d'instances/services modifiés
   - Coûts estimés (si disponible)

FORMAT DES ARGUMENTS :
- environmentId: string (requis) - ID de l'environnement à mettre à l'échelle (format: "env-xxx")
- scaleType: string (requis) - Type de mise à l'échelle :
  * "up" : Augmenter les ressources
  * "down" : Réduire les ressources
  * "auto" : Ajustement automatique basé sur les métriques
- targetInstances: number (optionnel) - Nombre cible d'instances (pour scaleType "up" ou "down")
- targetReplicas: number (optionnel) - Nombre cible de répliques par service (pour scaleType "up" ou "down")
- metricsThreshold: object (optionnel) - Seuils pour scaleType "auto" :
  * {cpuHigh: number, cpuLow: number, memoryHigh: number, memoryLow: number}

VALIDATIONS :
- Vérifier que l'environnement existe
- Pour "down" : s'assurer qu'on ne descend pas en dessous de 1 instance/service
- Pour "auto" : vérifier que les métriques sont disponibles
- Vérifier les limites de l'environnement (max instances/services)

GESTION DES ERREURS :
- Si l'environnement n'existe pas : retourner erreur
- Si scaleType invalide : retourner erreur avec valeurs acceptées
- Si la mise à l'échelle échoue : retourner l'état partiel et les erreurs
- Si les métriques ne sont pas disponibles pour "auto" : basculer sur "up" ou "down" manuel

EXEMPLE DE SÉQUENCE (scaleType="up") :
1. layerops_get_environment({environmentId: "env-123"}) → vérifier environnement
2. layerops_list_instances({environmentId: "env-123"}) → état actuel (2 instances)
3. layerops_list_services({environmentId: "env-123"}) → état actuel (3 services avec 2 répliques chacun)
4. layerops_create_instance({name: "web-3", instanceType: "t2.medium", region: "eu-west-1", environmentId: "env-123"}) → créer instance
5. layerops_scale_service({serviceId: "svc-1", replicas: 5}) → augmenter répliques
6. layerops_scale_service({serviceId: "svc-2", replicas: 5}) → augmenter répliques
7. Générer rapport final`,
    arguments: [
      {
        name: 'environmentId',
        description: 'ID de l\'environnement à mettre à l\'échelle (format: "env-xxx"). Vérifier d\'abord que l\'environnement existe.',
        required: true,
      },
      {
        name: 'scaleType',
        description: 'Type de mise à l\'échelle : "up" (augmenter), "down" (réduire), ou "auto" (ajustement automatique basé sur les métriques)',
        required: true,
      },
      {
        name: 'targetInstances',
        description: 'Nombre cible d\'instances (optionnel, pour scaleType "up" ou "down"). Si non spécifié, augmenter/réduire de 1.',
        required: false,
      },
      {
        name: 'targetReplicas',
        description: 'Nombre cible de répliques par service (optionnel, pour scaleType "up" ou "down"). Si non spécifié, augmenter/réduire de 1.',
        required: false,
      },
      {
        name: 'metricsThreshold',
        description: 'Seuils de métriques pour scaleType "auto" (optionnel). Format: {cpuHigh: 80, cpuLow: 20, memoryHigh: 85, memoryLow: 30}',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-monitor-infrastructure',
    description: `Surveille l'infrastructure LayerOps et génère un rapport de santé détaillé incluant métriques, événements et alertes.

INSTRUCTIONS DÉTAILLÉES :
1. Si environmentId est fourni :
   - Vérifier que l'environnement existe avec layerops_get_environment
   - Récupérer les instances avec layerops_list_instances filtrées par environmentId
   - Si includeServices est true, récupérer les services avec layerops_list_services
2. Si environmentId n'est pas fourni :
   - Récupérer tous les environnements avec layerops_list_environments
   - Pour chaque environnement, récupérer instances et services
3. Pour chaque instance :
   - Récupérer les métriques récentes avec layerops_get_instance_monitoring
   - Analyser CPU, mémoire, disque, réseau
   - Vérifier l'état (running, stopped, error)
   - Récupérer les événements récents avec layerops_list_events filtrés par instance
4. Pour chaque service (si includeServices est true) :
   - Récupérer les métriques avec layerops_get_service_monitoring
   - Vérifier le nombre de répliques et leur état
   - Récupérer les événements récents
5. Analyser les événements globaux avec layerops_list_events pour détecter les alertes
6. Générer un rapport structuré avec :
   - Résumé exécutif (état global, nombre de ressources, alertes critiques)
   - Détails par environnement (si multiple)
   - Métriques par instance (CPU, mémoire, disque, réseau)
   - Métriques par service (si inclus)
   - Événements récents et alertes
   - Recommandations basées sur les métriques
   - Indicateurs de santé (vert/jaune/rouge)

FORMAT DES ARGUMENTS :
- environmentId: string (optionnel) - ID de l'environnement à surveiller. Si non fourni, surveiller toute l'infrastructure.
- includeServices: boolean (optionnel, défaut: true) - Inclure les services dans le monitoring
- timeRange: string (optionnel) - Période d'analyse (ex: "1h", "24h", "7d"). Format ISO 8601 pour dates précises.
- alertThresholds: object (optionnel) - Seuils d'alerte personnalisés :
  * {cpu: number, memory: number, disk: number} (ex: {cpu: 80, memory: 85, disk: 90})

VALIDATIONS :
- Vérifier que les IDs d'environnement existent
- Vérifier que les métriques sont disponibles (peuvent prendre quelques minutes après création)
- Gérer les cas où les métriques ne sont pas encore disponibles

GESTION DES ERREURS :
- Si l'environnement n'existe pas : retourner erreur
- Si les métriques ne sont pas disponibles : indiquer dans le rapport
- Si une ressource est inaccessible : l'indiquer dans le rapport

EXEMPLE DE SÉQUENCE :
1. layerops_get_environment({environmentId: "env-123"}) → vérifier environnement
2. layerops_list_instances({environmentId: "env-123"}) → liste instances
3. layerops_list_services({environmentId: "env-123"}) → liste services
4. Pour chaque instance :
   - layerops_get_instance_monitoring({instanceId: "inst-1", startTime: "2024-01-01T00:00:00Z"})
   - layerops_list_events({resourceType: "instance", resourceId: "inst-1"})
5. Pour chaque service :
   - layerops_get_service_monitoring({serviceId: "svc-1", startTime: "2024-01-01T00:00:00Z"})
6. layerops_list_events({}) → événements globaux
7. Générer rapport structuré avec toutes les métriques`,
    arguments: [
      {
        name: 'environmentId',
        description: 'ID de l\'environnement à surveiller (format: "env-xxx"). Si non fourni, surveiller toute l\'infrastructure. Vérifier d\'abord que l\'environnement existe.',
        required: false,
      },
      {
        name: 'includeServices',
        description: 'Inclure les services dans le monitoring (défaut: true). Mettre à false pour surveiller uniquement les instances.',
        required: false,
      },
      {
        name: 'timeRange',
        description: 'Période d\'analyse. Format court: "1h", "24h", "7d". Format ISO 8601: "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z".',
        required: false,
      },
      {
        name: 'alertThresholds',
        description: 'Seuils d\'alerte personnalisés. Format: {cpu: 80, memory: 85, disk: 90}. Défaut: {cpu: 80, memory: 85, disk: 90}.',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-analyze-costs',
    description: `Analyse les coûts de l'infrastructure LayerOps et fournit des recommandations détaillées d'optimisation.

INSTRUCTIONS DÉTAILLÉES :
1. Si environmentId est fourni :
   - Vérifier que l'environnement existe avec layerops_get_environment
   - Récupérer les analytics avec layerops_get_analytics filtrés par environmentId
2. Si environmentId n'est pas fourni :
   - Récupérer les analytics globaux avec layerops_get_analytics
   - Optionnellement, analyser par environnement pour comparaison
3. Récupérer la liste des instances avec layerops_list_instances
4. Récupérer la liste des services avec layerops_list_services
5. Analyser les coûts :
   - Coûts par type de ressource (instances, services, stockage, réseau)
   - Coûts par environnement (si multiple)
   - Évolution des coûts sur la période
   - Coûts par région (si applicable)
6. Identifier les opportunités d'optimisation :
   - Instances sous-utilisées (CPU/mémoire < 20%) → suggérer réduction de taille
   - Instances sur-utilisées (CPU/mémoire > 90%) → suggérer augmentation
   - Services avec trop de répliques → suggérer réduction
   - Services avec trop peu de répliques → suggérer augmentation pour HA
   - Instances arrêtées mais facturées → suggérer suppression
   - Comparer les coûts entre environnements similaires
7. Récupérer les métriques de monitoring pour chaque ressource :
   - Utilisation CPU, mémoire, disque, réseau
   - Corréler avec les coûts
8. Générer un rapport détaillé avec :
   - Résumé exécutif (coût total, évolution, tendances)
   - Répartition des coûts (par type, par environnement, par région)
   - Top 10 des ressources les plus coûteuses
   - Opportunités d'optimisation avec estimation d'économies
   - Recommandations prioritaires (impact élevé, effort faible)
   - Plan d'action suggéré

FORMAT DES ARGUMENTS :
- environmentId: string (optionnel) - ID de l'environnement à analyser. Si non fourni, analyse globale.
- period: string (optionnel, défaut: "last-month") - Période d'analyse :
  * "last-week" : Dernière semaine
  * "last-month" : Dernier mois (défaut)
  * "last-quarter" : Dernier trimestre
  * "last-year" : Dernière année
  * "custom" : Utiliser startTime et endTime
- startTime: string (optionnel) - Date de début au format ISO 8601 (ex: "2024-01-01T00:00:00Z")
- endTime: string (optionnel) - Date de fin au format ISO 8601 (ex: "2024-01-31T23:59:59Z")
- includeRecommendations: boolean (optionnel, défaut: true) - Inclure les recommandations d'optimisation
- costThreshold: number (optionnel) - Seuil de coût pour alerter (ex: 1000 pour alerter si > 1000€)

VALIDATIONS :
- Vérifier que les dates sont valides si period="custom"
- Vérifier que startTime < endTime
- Vérifier que l'environnement existe si environmentId est fourni

GESTION DES ERREURS :
- Si l'environnement n'existe pas : retourner erreur
- Si les analytics ne sont pas disponibles : indiquer dans le rapport
- Si la période est invalide : utiliser la période par défaut

EXEMPLE DE SÉQUENCE :
1. layerops_get_environment({environmentId: "env-123"}) → vérifier environnement
2. layerops_get_analytics({environmentId: "env-123", startTime: "2024-01-01T00:00:00Z", endTime: "2024-01-31T23:59:59Z"}) → analytics
3. layerops_list_instances({environmentId: "env-123"}) → liste instances
4. layerops_list_services({environmentId: "env-123"}) → liste services
5. Pour chaque instance coûteuse :
   - layerops_get_instance_monitoring({instanceId: "inst-1"}) → métriques
6. Analyser corrélation coûts/utilisation
7. Générer rapport avec recommandations`,
    arguments: [
      {
        name: 'environmentId',
        description: 'ID de l\'environnement à analyser (format: "env-xxx"). Si non fourni, analyse globale de toute l\'infrastructure. Vérifier d\'abord que l\'environnement existe.',
        required: false,
      },
      {
        name: 'period',
        description: 'Période d\'analyse : "last-week", "last-month" (défaut), "last-quarter", "last-year", ou "custom" (nécessite startTime/endTime).',
        required: false,
      },
      {
        name: 'startTime',
        description: 'Date de début au format ISO 8601 (ex: "2024-01-01T00:00:00Z"). Requis si period="custom".',
        required: false,
      },
      {
        name: 'endTime',
        description: 'Date de fin au format ISO 8601 (ex: "2024-01-31T23:59:59Z"). Requis si period="custom".',
        required: false,
      },
      {
        name: 'includeRecommendations',
        description: 'Inclure les recommandations détaillées d\'optimisation dans le rapport (défaut: true).',
        required: false,
      },
      {
        name: 'costThreshold',
        description: 'Seuil de coût pour alerter dans le rapport (ex: 1000 pour alerter si coût > 1000€).',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-troubleshoot',
    description: `Diagnostique les problèmes d'infrastructure LayerOps en analysant les événements, métriques et logs pour identifier la cause racine.

INSTRUCTIONS DÉTAILLÉES :
1. Si resourceId est fourni :
   - Vérifier que la ressource existe selon son type :
     * instance → layerops_get_instance
     * service → layerops_get_service
     * environment → layerops_get_environment
   - Récupérer les détails de la ressource
2. Si resourceId n'est pas fourni mais resourceType est fourni :
   - Lister toutes les ressources de ce type
   - Identifier celles avec des problèmes (état error, stopped inattendu, etc.)
3. Si ni resourceId ni resourceType ne sont fournis :
   - Analyser toute l'infrastructure
   - Identifier les ressources avec problèmes
4. Pour chaque ressource à diagnostiquer :
   - Récupérer les événements récents avec layerops_list_events filtrés par ressource
   - Analyser les événements par sévérité (error, warning, info)
   - Identifier les patterns dans les événements (erreurs récurrentes, timing)
   - Récupérer les métriques récentes :
     * Pour instance : layerops_get_instance_monitoring
     * Pour service : layerops_get_service_monitoring
   - Analyser les métriques pour anomalies :
     * CPU anormalement élevé/bas
     * Mémoire saturée
     * Disque plein
     * Réseau bloqué
   - Corréler les événements avec les métriques
5. Analyser les événements globaux avec layerops_list_events pour contexte
6. Identifier les causes probables :
   - Problèmes de configuration
   - Problèmes de ressources (CPU/mémoire insuffisantes)
   - Problèmes réseau
   - Problèmes de dépendances (services liés)
   - Problèmes de déploiement
7. Générer un rapport de diagnostic avec :
   - Résumé exécutif (problèmes identifiés, sévérité)
   - Détails par ressource (état, événements, métriques)
   - Analyse des causes probables
   - Recommandations de résolution par ordre de priorité
   - Actions suggérées avec séquence d'exécution
   - Prévention (comment éviter le problème à l'avenir)

FORMAT DES ARGUMENTS :
- resourceType: string (optionnel) - Type de ressource à diagnostiquer : "instance", "service", "environment", ou "all"
- resourceId: string (optionnel) - ID de la ressource spécifique à diagnostiquer (format: "inst-xxx", "svc-xxx", "env-xxx")
- timeRange: string (optionnel) - Période d'analyse (ex: "1h", "24h", "7d"). Format ISO 8601 pour dates précises.
- severity: string (optionnel) - Filtrer par sévérité : "error", "warning", "info", ou "all" (défaut)
- includeMetrics: boolean (optionnel, défaut: true) - Inclure l'analyse des métriques dans le diagnostic

VALIDATIONS :
- Vérifier que resourceId correspond au resourceType si les deux sont fournis
- Vérifier que la ressource existe
- Vérifier que les dates sont valides si timeRange est au format ISO

GESTION DES ERREURS :
- Si la ressource n'existe pas : retourner erreur
- Si les métriques ne sont pas disponibles : continuer avec les événements uniquement
- Si aucun problème n'est détecté : retourner rapport positif avec état de santé

EXEMPLE DE SÉQUENCE (instance avec problème) :
1. layerops_get_instance({instanceId: "inst-123"}) → vérifier instance et état
2. layerops_list_events({resourceType: "instance", resourceId: "inst-123"}) → événements récents
3. layerops_get_instance_monitoring({instanceId: "inst-123", startTime: "2024-01-01T00:00:00Z"}) → métriques
4. Analyser corrélation événements/métriques :
   - Événement "CPU threshold exceeded" à 14:30
   - Métrique CPU à 95% à 14:30
   - Cause probable : charge trop élevée
5. Vérifier services liés :
   - layerops_list_services({environmentId: "env-456"}) → services dans le même environnement
6. Générer rapport avec :
   - Problème identifié : CPU saturé
   - Cause : charge trop élevée
   - Recommandation : augmenter taille instance ou ajouter instances
   - Action : layerops_update_instance ou layerops_create_instance`,
    arguments: [
      {
        name: 'resourceType',
        description: 'Type de ressource à diagnostiquer : "instance", "service", "environment", ou "all" (défaut). Si resourceId est fourni, ce paramètre est optionnel.',
        required: false,
      },
      {
        name: 'resourceId',
        description: 'ID de la ressource spécifique à diagnostiquer (format: "inst-xxx", "svc-xxx", "env-xxx"). Si fourni, resourceType peut être omis (sera détecté automatiquement).',
        required: false,
      },
      {
        name: 'timeRange',
        description: 'Période d\'analyse pour les événements et métriques. Format court: "1h", "24h", "7d". Format ISO 8601: "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z".',
        required: false,
      },
      {
        name: 'severity',
        description: 'Filtrer les événements par sévérité : "error" (uniquement erreurs), "warning" (avertissements et erreurs), "info" (tous), ou "all" (défaut).',
        required: false,
      },
      {
        name: 'includeMetrics',
        description: 'Inclure l\'analyse des métriques dans le diagnostic (défaut: true). Mettre à false pour analyser uniquement les événements.',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-convert-docker-compose',
    description: `Convertit un fichier Docker Compose en spécification LayerOps et déploie l'infrastructure correspondante.

INSTRUCTIONS DÉTAILLÉES :
1. Lire et parser le fichier Docker Compose fourni (format YAML)
2. Valider la structure du fichier Docker Compose :
   - Vérifier la version du format (2.x, 3.x, 3.8, etc.)
   - Identifier tous les services définis
   - Extraire les dépendances entre services (depends_on)
3. Analyser chaque service Docker Compose :
   - Image : extraire l'image Docker (repository:tag)
   - Ports : convertir le format Docker Compose en format LayerOps
     * Format Docker: "8080:80" ou "8080-8090:80-90" ou "80"
     * Format LayerOps: [{containerPort: number, hostPort?: number}]
   - Environment : extraire les variables d'environnement
     * Format Docker: KEY=value ou KEY (référence à .env)
     * Format LayerOps: {KEY: "value"}
   - Volumes : identifier les volumes (note: LayerOps gère différemment)
   - Networks : identifier les réseaux (note: LayerOps gère différemment)
   - Command/Entrypoint : noter pour documentation
   - Restart policy : noter pour documentation
   - Healthcheck : noter pour documentation
4. Créer un plan de migration :
   - Liste des services à créer
   - Ordre de déploiement (en respectant depends_on)
   - Mappings des ports
   - Variables d'environnement à configurer
   - Notes sur les limitations (volumes, networks, etc.)
5. Si projectName et environmentId sont fournis :
   - Vérifier que l'environnement existe
   - Déployer chaque service dans l'ordre avec layerops_create_service
   - Configurer les variables d'environnement
   - Configurer les ports
   - Attendre la confirmation de chaque service avant le suivant
6. Si projectName et environmentId ne sont pas fournis :
   - Générer uniquement la spécification LayerOps (JSON/YAML)
   - Ne pas déployer, seulement documenter
7. Gérer les dépendances entre services :
   - Si service A dépend de service B, déployer B avant A
   - Configurer les variables d'environnement pour les URLs de dépendances
   - Utiliser les noms de services LayerOps pour les connexions
8. Générer un rapport de conversion avec :
   - Résumé des services convertis
   - Mappings Docker Compose → LayerOps
   - Limitations et différences
   - Instructions pour les éléments non supportés (volumes, networks personnalisés)
   - Plan de déploiement si applicable

FORMAT DES ARGUMENTS :
- dockerComposeFile: string (requis) - Contenu du fichier docker-compose.yml (YAML) ou chemin vers le fichier
- projectName: string (optionnel) - Nom du projet LayerOps. Si fourni avec environmentId, déploie l'infrastructure
- environmentId: string (optionnel) - ID de l'environnement LayerOps. Si fourni avec projectName, déploie l'infrastructure
- outputFormat: string (optionnel, défaut: "spec") - Format de sortie : "spec" (spécification uniquement), "deploy" (déployer), ou "both" (spécification + déploiement)
- servicePrefix: string (optionnel) - Préfixe à ajouter aux noms de services (ex: "prod-" pour éviter conflits)
- portMapping: object (optionnel) - Mappings personnalisés de ports : {serviceName: {containerPort: hostPort}}
- envFile: string (optionnel) - Contenu du fichier .env pour résoudre les variables d'environnement

CONVERSIONS DÉTAILLÉES :

1. Ports Docker Compose → LayerOps :
   - "8080:80" → [{containerPort: 80, hostPort: 8080}]
   - "80" → [{containerPort: 80}]
   - "8080-8090:80-90" → [{containerPort: 80, hostPort: 8080}, ..., {containerPort: 90, hostPort: 8090}]
   - [8080, "9090:90"] → [{containerPort: 8080}, {containerPort: 90, hostPort: 9090}]

2. Variables d'environnement :
   - KEY=value → {KEY: "value"}
   - KEY (sans valeur) → chercher dans .env ou utiliser valeur par défaut
   - \${VAR} ou $VAR → résoudre depuis .env ou variables système

3. Dépendances (depends_on) :
   - Créer les services dans l'ordre des dépendances
   - Utiliser les noms de services LayerOps pour les connexions
   - Configurer les variables d'environnement avec les URLs des dépendances

LIMITATIONS ET NOTES :
- Volumes : LayerOps gère le stockage différemment, documenter les volumes nécessaires
- Networks personnalisés : LayerOps utilise son propre réseau, documenter les besoins
- Build context : Les services avec "build" nécessitent une image pré-construite
- Command/Entrypoint : Noter pour référence mais LayerOps utilise l'image telle quelle
- Restart policy : LayerOps gère automatiquement la haute disponibilité
- Healthcheck : Noter pour référence, LayerOps a son propre monitoring

VALIDATIONS :
- Vérifier que le fichier Docker Compose est valide (YAML valide)
- Vérifier que toutes les images référencées sont accessibles
- Vérifier que les ports ne sont pas en conflit
- Vérifier que les dépendances sont valides (pas de cycles)
- Si déploiement : vérifier que l'environnement existe

GESTION DES ERREURS :
- Si le fichier Docker Compose est invalide : retourner erreur avec détails
- Si une image n'est pas accessible : alerter mais continuer
- Si un port est en conflit : suggérer un port alternatif
- Si une dépendance est manquante : arrêter et alerter
- Si le déploiement échoue : retourner l'état partiel et les erreurs

EXEMPLE DE SÉQUENCE :
1. Parser docker-compose.yml
2. Identifier 3 services : web, api, db
3. Analyser dépendances : web → api → db
4. Ordre de déploiement : db, api, web
5. Si déploiement demandé :
   - layerops_create_service({name: "db", image: "postgres:14", environmentId: "env-123"})
   - Attendre confirmation
   - layerops_create_service({name: "api", image: "myapp/api:latest", environmentId: "env-123", env: {DB_HOST: "db"}})
   - Attendre confirmation
   - layerops_create_service({name: "web", image: "myapp/web:latest", environmentId: "env-123", ports: [{containerPort: 80}], env: {API_URL: "http://api"}})
6. Générer rapport avec mappings et limitations`,
    arguments: [
      {
        name: 'dockerComposeFile',
        description: 'Contenu du fichier docker-compose.yml au format YAML, ou chemin vers le fichier. Le fichier doit être valide et contenir au moins un service.',
        required: true,
      },
      {
        name: 'projectName',
        description: 'Nom du projet LayerOps. Si fourni avec environmentId, l\'infrastructure sera déployée. Si non fourni, seule la spécification sera générée.',
        required: false,
      },
      {
        name: 'environmentId',
        description: 'ID de l\'environnement LayerOps (format: "env-xxx"). Si fourni avec projectName, l\'infrastructure sera déployée. Vérifier d\'abord que l\'environnement existe.',
        required: false,
      },
      {
        name: 'outputFormat',
        description: 'Format de sortie : "spec" (générer uniquement la spécification LayerOps), "deploy" (déployer l\'infrastructure), ou "both" (spécification + déploiement, défaut si projectName/environmentId fournis).',
        required: false,
      },
      {
        name: 'servicePrefix',
        description: 'Préfixe à ajouter aux noms de services LayerOps (ex: "prod-", "staging-"). Utile pour éviter les conflits de noms.',
        required: false,
      },
      {
        name: 'portMapping',
        description: 'Mappings personnalisés de ports. Format: {serviceName: {containerPort: hostPort}}. Exemple: {"web": {80: 8080}, "api": {3000: 3000}}.',
        required: false,
      },
      {
        name: 'envFile',
        description: 'Contenu du fichier .env pour résoudre les variables d\'environnement du Docker Compose. Format: KEY=value (une par ligne).',
        required: false,
      },
    ],
  },
  {
    name: 'layerops-convert-helm',
    description: `Convertit un chart Helm en spécification LayerOps et déploie l'infrastructure correspondante.

INSTRUCTIONS DÉTAILLÉES :
1. Analyser la structure du chart Helm :
   - Lire Chart.yaml pour identifier le chart (nom, version, description)
   - Lire values.yaml pour les valeurs par défaut
   - Identifier tous les templates dans le dossier templates/
   - Parser les templates Kubernetes (Deployments, Services, ConfigMaps, Secrets, etc.)
2. Extraire les ressources Kubernetes principales :
   - Deployments → Services LayerOps
   - Services (ClusterIP, LoadBalancer, NodePort) → Configuration de ports LayerOps
   - ConfigMaps → Variables d'environnement LayerOps
   - Secrets → Variables d'environnement sécurisées LayerOps
   - PersistentVolumeClaims → Noter pour documentation (gestion différente)
   - Ingress → Noter pour documentation (gestion différente)
3. Pour chaque Deployment identifié :
   - Extraire l'image container (repository:tag)
   - Extraire les ports exposés (containerPort)
   - Extraire les variables d'environnement (env, envFrom)
   - Extraire les ressources (requests/limits CPU/memory)
   - Extraire le nombre de replicas
   - Identifier les dépendances (initContainers, volumes)
4. Convertir les ressources Kubernetes en format LayerOps :
   - Deployment → Service LayerOps avec :
     * name: nom du Deployment (ou nom du chart + nom du template)
     * image: image du container principal
     * ports: ports du container
     * env: variables d'environnement consolidées
     * replicas: nombre de replicas
   - Service Kubernetes → Configuration de ports LayerOps
   - ConfigMap → Variables d'environnement dans env
   - Secret → Variables d'environnement dans env (avec note de sécurité)
5. Gérer les dépendances :
   - Analyser les dépendances entre ressources (Service → Deployment)
   - Créer un ordre de déploiement
   - Configurer les variables d'environnement pour les connexions entre services
   - Utiliser les noms de services LayerOps pour les URLs
6. Gérer les valeurs Helm :
   - Remplacer les placeholders {{ .Values.* }} par les valeurs fournies
   - Utiliser values.yaml comme valeurs par défaut
   - Permettre la surcharge avec des valeurs personnalisées
7. Si projectName et environmentId sont fournis :
   - Vérifier que l'environnement existe
   - Déployer chaque service dans l'ordre avec layerops_create_service
   - Configurer les variables d'environnement
   - Configurer les ports
   - Attendre la confirmation de chaque service
8. Si projectName et environmentId ne sont pas fournis :
   - Générer uniquement la spécification LayerOps (JSON/YAML)
   - Ne pas déployer, seulement documenter
9. Générer un rapport de conversion avec :
   - Résumé des ressources converties
   - Mappings Kubernetes → LayerOps
   - Limitations et différences
   - Instructions pour les éléments non supportés
   - Plan de déploiement si applicable

FORMAT DES ARGUMENTS :
- helmChartPath: string (requis) - Chemin vers le dossier du chart Helm ou archive .tgz, ou contenu structuré du chart
- projectName: string (optionnel) - Nom du projet LayerOps. Si fourni avec environmentId, déploie l'infrastructure
- environmentId: string (optionnel) - ID de l'environnement LayerOps. Si fourni avec projectName, déploie l'infrastructure
- outputFormat: string (optionnel, défaut: "spec") - Format de sortie : "spec" (spécification uniquement), "deploy" (déployer), ou "both"
- values: object (optionnel) - Valeurs Helm personnalisées pour remplacer values.yaml (format: {key: value})
- servicePrefix: string (optionnel) - Préfixe à ajouter aux noms de services (ex: "prod-")
- portMapping: object (optionnel) - Mappings personnalisés de ports : {serviceName: {containerPort: hostPort}}
- includeResources: array (optionnel) - Types de ressources à inclure : ["deployments", "services", "configmaps", "secrets"]. Défaut: tous

CONVERSIONS DÉTAILLÉES :

1. Deployment Kubernetes → Service LayerOps :
   - spec.template.spec.containers[0].image → image
   - spec.template.spec.containers[0].ports → ports (containerPort)
   - spec.template.spec.containers[0].env → env
   - spec.template.spec.containers[0].envFrom → env (depuis ConfigMap/Secret)
   - spec.replicas → replicas
   - metadata.name → name (avec préfixe si fourni)
   - spec.template.spec.containers[0].resources → noter pour documentation (LayerOps gère différemment)

2. Service Kubernetes → Configuration de ports :
   - spec.type: "ClusterIP" → ports internes uniquement
   - spec.type: "LoadBalancer" → ports avec hostPort
   - spec.type: "NodePort" → ports avec hostPort (nodePort)
   - spec.ports[].port → hostPort
   - spec.ports[].targetPort → containerPort

3. ConfigMap → Variables d'environnement :
   - data → env (toutes les clés/valeurs)
   - binaryData → noter pour documentation (nécessite traitement spécial)

4. Secret → Variables d'environnement :
   - data → env (décoder base64)
   - stringData → env (direct)
   - Noter que les secrets doivent être gérés sécuritairement

5. Variables d'environnement consolidées :
   - env du Deployment
   + envFrom ConfigMaps
   + envFrom Secrets
   = env final pour LayerOps

LIMITATIONS ET NOTES :
- PersistentVolumeClaims : LayerOps gère le stockage différemment, documenter les besoins
- Ingress : LayerOps a son propre système de routage, documenter les besoins
- StatefulSets : Convertir en Services LayerOps mais noter les différences
- DaemonSets : Noter pour documentation (non directement supporté)
- Jobs/CronJobs : Noter pour documentation (nécessite adaptation)
- ServiceAccounts : Noter pour documentation (gestion différente)
- RBAC (Roles, RoleBindings) : Géré via LayerOps RBAC, documenter les besoins
- NetworkPolicies : Noter pour documentation (LayerOps gère différemment)
- HPA (HorizontalPodAutoscaler) : LayerOps a son propre autoscaling
- Resources (CPU/memory limits) : Noter pour documentation (LayerOps gère différemment)
- InitContainers : Noter pour documentation (nécessite adaptation)
- Sidecars : Noter pour documentation (nécessite adaptation)

VALIDATIONS :
- Vérifier que le chart Helm est valide (structure correcte)
- Vérifier que Chart.yaml existe et est valide
- Vérifier que les templates sont valides (YAML valide après rendu)
- Vérifier que toutes les images référencées sont accessibles
- Vérifier que les ports ne sont pas en conflit
- Vérifier que les dépendances sont valides (pas de cycles)
- Si déploiement : vérifier que l'environnement existe

GESTION DES ERREURS :
- Si le chart Helm est invalide : retourner erreur avec détails
- Si un template ne peut pas être rendu : alerter mais continuer avec les autres
- Si une image n'est pas accessible : alerter mais continuer
- Si un port est en conflit : suggérer un port alternatif
- Si une dépendance est manquante : arrêter et alerter
- Si le déploiement échoue : retourner l'état partiel et les erreurs

EXEMPLE DE SÉQUENCE :
1. Lire Chart.yaml → identifier chart "myapp" version "1.0.0"
2. Lire values.yaml → valeurs par défaut
3. Parser templates/deployment.yaml → Deployment "myapp-api"
4. Extraire :
   - image: "myregistry/api:v1.0"
   - ports: [{containerPort: 8080}]
   - env: [{name: "ENV", value: "production"}]
   - replicas: 3
5. Parser templates/configmap.yaml → ConfigMap "myapp-config"
6. Consolider env: Deployment env + ConfigMap data
7. Si déploiement demandé :
   - layerops_create_service({
       name: "myapp-api",
       image: "myregistry/api:v1.0",
       environmentId: "env-123",
       ports: [{containerPort: 8080}],
       env: {ENV: "production", CONFIG_KEY: "value"},
       replicas: 3
     })
8. Générer rapport avec mappings et limitations`,
    arguments: [
      {
        name: 'helmChartPath',
        description: 'Chemin vers le dossier du chart Helm (contenant Chart.yaml), archive .tgz, ou contenu structuré du chart. Le chart doit être valide et contenir au moins un template Kubernetes.',
        required: true,
      },
      {
        name: 'projectName',
        description: 'Nom du projet LayerOps. Si fourni avec environmentId, l\'infrastructure sera déployée. Si non fourni, seule la spécification sera générée.',
        required: false,
      },
      {
        name: 'environmentId',
        description: 'ID de l\'environnement LayerOps (format: "env-xxx"). Si fourni avec projectName, l\'infrastructure sera déployée. Vérifier d\'abord que l\'environnement existe.',
        required: false,
      },
      {
        name: 'outputFormat',
        description: 'Format de sortie : "spec" (générer uniquement la spécification LayerOps), "deploy" (déployer l\'infrastructure), ou "both" (spécification + déploiement, défaut si projectName/environmentId fournis).',
        required: false,
      },
      {
        name: 'values',
        description: 'Valeurs Helm personnalisées pour remplacer ou compléter values.yaml. Format: {key: value}. Exemple: {replicaCount: 5, image.tag: "v2.0"}.',
        required: false,
      },
      {
        name: 'servicePrefix',
        description: 'Préfixe à ajouter aux noms de services LayerOps (ex: "prod-", "staging-"). Utile pour éviter les conflits de noms.',
        required: false,
      },
      {
        name: 'portMapping',
        description: 'Mappings personnalisés de ports. Format: {serviceName: {containerPort: hostPort}}. Exemple: {"api": {8080: 80}, "web": {3000: 3000}}.',
        required: false,
      },
      {
        name: 'includeResources',
        description: 'Types de ressources Kubernetes à inclure dans la conversion. Format: ["deployments", "services", "configmaps", "secrets"]. Défaut: tous les types supportés.',
        required: false,
      },
    ],
  },
];

