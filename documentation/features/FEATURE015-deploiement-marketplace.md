# FEATURE015 - Déploiement depuis la marketplace LayerOps

## User Story

En tant qu'utilisateur, je veux pouvoir déployer une application depuis la marketplace LayerOps avec un minimum de connaissances techniques, en répondant à des questions guidées qui me permettent de configurer l'application sans avoir besoin de comprendre les détails techniques.

## Description

Cette fonctionnalité permet de déployer des applications pré-configurées depuis la marketplace LayerOps via un processus interactif de questions/réponses. L'agent LLM guide l'utilisateur à travers les étapes nécessaires pour configurer et déployer l'application.

## Fonctionnalités

### Processus guidé

1. **Découverte** : L'agent présente les catégories d'applications disponibles (bases de données, serveurs web, monitoring, etc.)
2. **Sélection** : L'utilisateur choisit une catégorie puis une application spécifique
3. **Configuration** : L'agent pose des questions essentielles pour configurer l'application :
   - Nom du service
   - Environnement de déploiement
   - Configuration des ressources (CPU, mémoire)
   - Ports à exposer
   - Variables d'environnement
   - Secrets requis (via placeholders sécurisés)
4. **Déploiement** : L'agent crée le projet/environnement si nécessaire et déploie l'application
5. **Documentation** : L'agent fournit un résumé avec les instructions de configuration des secrets

### Applications supportées

- **Bases de données** : PostgreSQL, MySQL, MongoDB, Redis, etc.
- **Serveurs web** : Nginx, Apache, Caddy, etc.
- **Monitoring** : Prometheus, Grafana, etc.
- **Développement** : GitLab, Jenkins, etc.
- **Applications métier** : WordPress, Nextcloud, etc.

## Sécurité des secrets

### Règle inviolable

**JAMAIS** inclure de mots de passe, clés API, tokens ou secrets dans l'historique du chat.

### Mécanisme de protection

1. **Placeholders** : Tous les secrets sont remplacés par des placeholders `{{SECRET_NAME}}` ou `$SECRET_NAME`
2. **Instructions séparées** : Les valeurs réelles des secrets sont fournies via :
   - Variables d'environnement (recommandé)
   - Fichier séparé non versionné (.env.local, secrets.json)
   - Système de gestion de secrets externe
3. **Alerte automatique** : Si un secret est accidentellement inclus dans un message, l'utilisateur est immédiatement alerté et doit régénérer le secret compromis

### Exemple de gestion de secret

**Dans le chat (sécurisé)** :
```
Configuration PostgreSQL :
- Nom du service : postgresql-prod
- Port : 5432
- Mot de passe : {{POSTGRES_PASSWORD}}
```

**Instructions fournies à l'utilisateur** :
```
Pour configurer le secret {{POSTGRES_PASSWORD}} :
1. Via variable d'environnement :
   export POSTGRES_PASSWORD="votre-mot-de-passe-securise"
2. Via fichier .env.local (non versionné) :
   POSTGRES_PASSWORD=votre-mot-de-passe-securise
```

## Utilisation

### Prompt MCP

```
layerops-deploy-marketplace
```

### Arguments

- `applicationCategory` (optionnel) : Catégorie d'application
- `applicationName` (optionnel) : Nom de l'application marketplace
- `projectName` (requis) : Nom du projet LayerOps
- `environmentName` (requis) : Nom de l'environnement
- `serviceName` (optionnel) : Nom du service à créer
- `interactiveMode` (optionnel) : Mode interactif avec questions/réponses
- `skipQuestions` (optionnel) : Passer directement au déploiement
- `configuration` (optionnel) : Configuration pré-remplie

### Exemple d'utilisation

```
Déploie PostgreSQL depuis la marketplace dans le projet "MonApp", environnement "production"
```

L'agent va :
1. Présenter les catégories disponibles
2. Si PostgreSQL est sélectionné, poser des questions :
   - Nom du service (défaut: "postgresql")
   - Port (défaut: 5432)
   - Mot de passe → utiliser placeholder {{POSTGRES_PASSWORD}}
   - Base de données initiale (défaut: "appdb")
   - Version PostgreSQL (défaut: "latest")
3. Déployer l'application
4. Fournir les instructions pour configurer {{POSTGRES_PASSWORD}}

## Limitations

- Les applications disponibles dépendent de la marketplace LayerOps
- Certaines configurations avancées peuvent nécessiter des connaissances techniques
- Les secrets doivent être configurés manuellement après le déploiement

## Références

- Documentation LayerOps Marketplace : `layerops://docs/marketplace`
- Prompt MCP : `layerops-deploy-marketplace`
- Schéma LayerOps : https://console.layerops.com/api/v1/services/exampleImportYml?format=text

