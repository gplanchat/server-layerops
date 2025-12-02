# FEATURE014 - Conversion Kubernetes vers LayerOps

## User Story

En tant qu'administrateur système,
Je veux convertir mes fichiers de ressources Kubernetes (YAML) en spécification LayerOps,
Afin de migrer mes applications Kubernetes existantes vers LayerOps sans passer par Helm.

## Description

Cette fonctionnalité permet de convertir directement des fichiers de ressources Kubernetes (Deployments, Services, ConfigMaps, Secrets, Ingress, etc.) en spécification LayerOps conforme au schéma de référence officiel.

Le prompt `layerops-convert-kubernetes` analyse les fichiers YAML Kubernetes, extrait les ressources principales, et génère une configuration LayerOps complète qui peut être déployée directement ou exportée comme spécification.

## Schéma de référence

La conversion suit strictement le schéma officiel LayerOps disponible à :
https://console.layerops.com/api/v1/services/exampleImportYml?format=text

Ce schéma est la référence absolue et sera mis à jour automatiquement quand de nouvelles fonctionnalités seront ajoutées à LayerOps.

## Fonctionnalités

### Conversion des ressources Kubernetes

- **Deployments** → Services LayerOps avec structure complète :
  - dockerConfiguration (image, imageVersion, isPrivateRegistry, secretUuid, command, args)
  - countMin/countMax (depuis spec.replicas ou HPA)
  - ports avec healthCheck et loadBalancerRules
  - environmentVariables (consolidation de env + envFrom)
  - Paramètres de scaling CPU/memory
  - sideTasks (depuis initContainers)

- **StatefulSets** → Services LayerOps (comme Deployment avec countMin=countMax)

- **Services** → Configuration de ports LayerOps :
  - ClusterIP → ports internes
  - LoadBalancer → ports avec loadBalancerRules
  - NodePort → ports avec loadBalancerRules

- **ConfigMaps** → environmentVariables avec isSensitive: false

- **Secrets** → environmentVariables avec isSensitive: true (décodage base64)

- **Ingress** → loadBalancerRules avec customDomains

- **Jobs/CronJobs** → Services avec cronExpression

- **Liveness/Readiness Probes** → healthCheck dans ports

- **HPA** → Paramètres de scaling LayerOps

### Gestion des dépendances

- Analyse automatique des références entre ressources
- Ordre de déploiement logique
- Configuration des variables d'environnement pour les connexions
- Configuration des links entre services

### Filtrage et personnalisation

- Filtrage par namespace
- Filtrage par type de ressource
- Préfixe pour les noms de services
- Mappings personnalisés de ports
- Mapping des secrets de registry (imagePullSecrets → secretUuid LayerOps)

## Critères d'acceptation

- [x] Le prompt peut parser un ou plusieurs fichiers Kubernetes YAML
- [x] Le prompt peut identifier tous les types de ressources Kubernetes supportés
- [x] Le prompt convertit les Deployments en Services LayerOps conformes au schéma
- [x] Le prompt convertit les Services Kubernetes en configuration de ports LayerOps
- [x] Le prompt consolide les variables d'environnement (env + envFrom)
- [x] Le prompt convertit les probes en healthCheck
- [x] Le prompt convertit les initContainers en sideTasks
- [x] Le prompt gère les dépendances entre ressources
- [x] Le prompt génère une configuration YAML conforme au schéma de référence
- [x] Le prompt peut déployer l'infrastructure si projectName et environmentId sont fournis
- [x] Le prompt génère un rapport de conversion complet
- [x] Le prompt documente les limitations et différences

## Exemple d'utilisation

```yaml
# Input: deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: myregistry/api:v1.2.0
        ports:
        - containerPort: 8080
        env:
        - name: ENV
          value: production
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
```

```yaml
# Output: Configuration LayerOps conforme au schéma
services:
  - name: api
    dockerConfiguration:
      image: myregistry/api
      imageVersion: v1.2.0
      isPrivateRegistry: true
      secretUuid: "secret-uuid-if-needed"
    countMin: 3
    countMax: 3
    ports:
      - listeningPort: 8080
        protocol: tcp
        healthCheck:
          healthCheckType: HTTP
          healthCheckPath: /health
          healthCheckMethod: GET
          healthCheckEnabled: true
          healthCheckTimeoutSeconds: 5
          healthCheckIntervalSeconds: 30
    environmentVariables:
      - key: ENV
        value: production
        isSensitive: false
    type: classic
    cpuLimit: 50
    memoryLimitMiB: 512
```

## Limitations connues

- PersistentVolumeClaims nécessitent une configuration manuelle des UUIDs LayerOps
- Ingress TLS nécessite une configuration manuelle
- ServiceAccounts gérés différemment via LayerOps RBAC
- NetworkPolicies gérés différemment via links LayerOps
- Custom Resources (CRDs) nécessitent un traitement manuel
- Sidecars nécessitent une adaptation via sideTasks

## Documentation

- [Documentation des prompts](prompts.md#9-conversion-kubernetes-yaml-vers-layerops)
- [Schéma de référence LayerOps](https://console.layerops.com/api/v1/services/exampleImportYml?format=text)


