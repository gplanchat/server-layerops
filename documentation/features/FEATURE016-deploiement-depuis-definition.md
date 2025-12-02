# FEATURE016 - Déploiement depuis une définition (LayerOps, Docker Compose, Helm, Kubernetes)

## User Story

En tant qu'utilisateur, je veux pouvoir déployer une application sur LayerOps à partir d'une définition existante (LayerOps YAML, Docker Compose, Helm chart, ou Kubernetes YAML), en utilisant les prompts de conversion existants, puis en déployant automatiquement le résultat.

## Description

Cette fonctionnalité permet de déployer des applications sur LayerOps à partir de différents formats de définition. Elle utilise les prompts de conversion existants (`layerops-convert-docker-compose`, `layerops-convert-helm`, `layerops-convert-kubernetes`) pour convertir la définition en format LayerOps, puis déploie automatiquement le résultat.

## Formats supportés

### 1. LayerOps YAML
Format natif LayerOps avec structure `services: [...]`. Déploiement direct sans conversion.

### 2. Docker Compose
Fichier `docker-compose.yml` standard. Conversion via `layerops-convert-docker-compose`.

### 3. Helm Chart
Chart Helm complet (dossier avec `Chart.yaml`, `values.yaml`, `templates/`). Conversion via `layerops-convert-helm`.

### 4. Kubernetes YAML
Ressources Kubernetes (Deployments, Services, ConfigMaps, Secrets, etc.). Conversion via `layerops-convert-kubernetes`.

## Processus de déploiement

### Phase 1 : Identification du format
- Analyse automatique du fichier pour déterminer son format
- Si non identifiable, demande de clarification à l'utilisateur

### Phase 2 : Conversion (si nécessaire)
- **Docker Compose** → Utilise `layerops-convert-docker-compose`
- **Helm** → Utilise `layerops-convert-helm`
- **Kubernetes** → Utilise `layerops-convert-kubernetes`
- **LayerOps** → Validation directe du schéma

### Phase 3 : Validation et préparation
- Validation de la spécification LayerOps générée
- Détection et remplacement des secrets par des placeholders
- Vérification/création du projet et de l'environnement

### Phase 4 : Déploiement
- Déploiement séquentiel des services (en respectant les dépendances)
- Configuration des variables d'environnement (avec placeholders pour secrets)
- Vérification de l'état de tous les services

### Phase 5 : Documentation
- Résumé du déploiement
- Liste des placeholders de secrets à configurer
- Instructions pour configurer les secrets réels
- Instructions de maintenance

## Sécurité des secrets

### Règle inviolable

**JAMAIS** inclure de mots de passe, clés API, tokens ou secrets dans l'historique du chat.

### Mécanisme de protection

1. **Détection automatique** : Pendant la conversion, tous les secrets sont détectés
2. **Remplacement par placeholders** : Les secrets sont remplacés par `{{SECRET_NAME}}` ou `$SECRET_NAME`
3. **Documentation** : Liste documentée de tous les placeholders créés
4. **Alerte** : Si un secret est détecté dans le fichier source, alerte immédiate
5. **Instructions séparées** : Les valeurs réelles sont fournies via variables d'environnement ou fichiers séparés

### Exemple de gestion de secret

**Fichier source (Docker Compose)** :
```yaml
services:
  db:
    environment:
      POSTGRES_PASSWORD: mon-mot-de-passe-secret
```

**Spécification LayerOps générée (sécurisée)** :
```yaml
services:
  - name: db
    environmentVariables:
      - key: POSTGRES_PASSWORD
        value: "{{DB_PASSWORD}}"
        isSensitive: true
```

**Instructions fournies** :
```
⚠️ Secret détecté et remplacé par placeholder
Pour configurer {{DB_PASSWORD}} :
1. Via variable d'environnement :
   export DB_PASSWORD="votre-mot-de-passe-securise"
2. Via fichier .env.local :
   DB_PASSWORD=votre-mot-de-passe-securise
```

## Utilisation

### Prompt MCP

```
layerops-deploy-from-definition
```

### Arguments

- `definitionFile` (requis) : Contenu du fichier ou chemin vers le fichier
- `definitionFormat` (optionnel) : Format explicite ("layerops", "docker-compose", "helm", "kubernetes")
- `projectName` (requis) : Nom du projet LayerOps
- `environmentName` (requis) : Nom de l'environnement
- `environmentId` (optionnel) : ID de l'environnement existant
- `autoDeploy` (optionnel) : Déployer automatiquement (défaut: true)
- `servicePrefix` (optionnel) : Préfixe pour les noms de services
- `secretPlaceholders` (optionnel) : Mapping des secrets vers placeholders personnalisés
- `registrySecrets` (optionnel) : Mapping des registries privés vers secretUuid LayerOps

### Exemple d'utilisation

#### Docker Compose
```
Déploie le fichier docker-compose.yml dans le projet "MonApp", environnement "production"
```

#### Helm Chart
```
Déploie le chart Helm dans ./my-chart dans le projet "MonApp", environnement "staging"
```

#### Kubernetes
```
Déploie les fichiers Kubernetes (deployment.yaml, service.yaml) dans le projet "MonApp", environnement "production"
```

#### LayerOps YAML
```
Déploie le fichier layerops-services.yaml dans le projet "MonApp", environnement "production"
```

## Intégration avec les prompts de conversion

Cette fonctionnalité utilise les prompts de conversion existants :

- **FEATURE012** : Conversion Docker Compose → LayerOps
- **FEATURE013** : Conversion Helm → LayerOps
- **FEATURE014** : Conversion Kubernetes → LayerOps

Le processus est le suivant :
1. Appel du prompt de conversion approprié
2. Récupération de la spécification LayerOps générée
3. Remplacement des secrets par des placeholders
4. Déploiement automatique des services

## Gestion des dépendances

Les dépendances entre services sont gérées automatiquement :
- Les services sont déployés dans l'ordre des dépendances
- Les variables d'environnement pour les URLs de dépendances sont configurées automatiquement
- Les IDs de services créés sont utilisés pour les connexions

## Limitations

- Certaines fonctionnalités avancées peuvent ne pas être supportées (volumes persistants complexes, réseaux personnalisés, etc.)
- Les secrets doivent être configurés manuellement après le déploiement
- Les conversions peuvent nécessiter des ajustements manuels pour certaines configurations

## Références

- **FEATURE012** : Conversion Docker Compose
- **FEATURE013** : Conversion Helm
- **FEATURE014** : Conversion Kubernetes
- Prompt MCP : `layerops-deploy-from-definition`
- Schéma LayerOps : https://console.layerops.com/api/v1/services/exampleImportYml?format=text

