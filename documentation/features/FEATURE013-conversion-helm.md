# FEATURE013 - Conversion Helm vers LayerOps

## User Story

En tant qu'utilisateur ayant une application Helm/Kubernetes existante, je souhaite pouvoir convertir mon chart Helm en spécification LayerOps et déployer automatiquement l'infrastructure correspondante, afin de faciliter la migration vers LayerOps.

## Description

Cette fonctionnalité permet de convertir un chart Helm en spécification LayerOps et optionnellement de déployer l'infrastructure correspondante. Elle facilite grandement la migration d'applications Kubernetes/Helm vers LayerOps en automatisant la conversion des ressources Kubernetes.

## Fonctionnalités

- **Parsing de chart Helm** : Lit et parse les fichiers Chart.yaml, values.yaml et templates
- **Extraction de ressources Kubernetes** : Identifie Deployments, Services, ConfigMaps, Secrets, etc.
- **Conversion de ressources** :
  - Deployments → Services LayerOps
  - Services Kubernetes → Configuration de ports LayerOps
  - ConfigMaps → Variables d'environnement LayerOps
  - Secrets → Variables d'environnement sécurisées LayerOps
- **Gestion des valeurs Helm** : Remplace les placeholders {{ .Values.* }} par les valeurs fournies
- **Gestion des dépendances** : Analyse les dépendances entre ressources et crée un plan de déploiement ordonné
- **Génération de spécification** : Crée une spécification LayerOps au format JSON/YAML
- **Déploiement optionnel** : Peut déployer automatiquement l'infrastructure convertie
- **Rapport de conversion** : Génère un rapport détaillé avec mappings et limitations

## Prompt MCP

- `layerops-convert-helm` : Convertit un chart Helm en spécification LayerOps

## Conversions supportées

### Deployments → Services LayerOps

- `spec.template.spec.containers[0].image` → `image`
- `spec.template.spec.containers[0].ports` → `ports` (containerPort)
- `spec.template.spec.containers[0].env` → `env`
- `spec.template.spec.containers[0].envFrom` → `env` (depuis ConfigMap/Secret)
- `spec.replicas` → `replicas`
- `metadata.name` → `name` (avec préfixe si fourni)

### Services Kubernetes → Configuration de ports

- `spec.type: "ClusterIP"` → ports internes uniquement
- `spec.type: "LoadBalancer"` → ports avec hostPort
- `spec.type: "NodePort"` → ports avec hostPort (nodePort)
- `spec.ports[].port` → hostPort
- `spec.ports[].targetPort` → containerPort

### ConfigMaps → Variables d'environnement

- `data` → `env` (toutes les clés/valeurs)
- `binaryData` → noter pour documentation (nécessite traitement spécial)

### Secrets → Variables d'environnement

- `data` → `env` (décoder base64)
- `stringData` → `env` (direct)
- Note : les secrets doivent être gérés sécuritairement

### Variables d'environnement consolidées

Les variables d'environnement sont consolidées depuis :
- `env` du Deployment
- `envFrom` ConfigMaps
- `envFrom` Secrets
= `env` final pour LayerOps

## Limitations

### Éléments nécessitant une attention manuelle

1. **PersistentVolumeClaims** :
   - LayerOps gère le stockage différemment
   - Nécessite documentation et configuration manuelle
   - Les volumes persistants doivent être configurés séparément

2. **Ingress** :
   - LayerOps a son propre système de routage
   - Les règles d'ingress nécessitent une adaptation
   - Documentation des besoins de routage

3. **StatefulSets** :
   - Convertir en Services LayerOps mais noter les différences
   - Les identités stables ne sont pas directement supportées
   - Nécessite adaptation pour les applications stateful

4. **DaemonSets** :
   - Non directement supporté dans LayerOps
   - Nécessite une approche différente (instances dédiées)

5. **Jobs/CronJobs** :
   - Nécessitent une adaptation
   - Les tâches ponctuelles doivent être gérées différemment
   - Les tâches récurrentes nécessitent une solution alternative

6. **ServiceAccounts** :
   - Gestion différente dans LayerOps
   - Les permissions doivent être configurées via LayerOps RBAC

7. **RBAC (Roles, RoleBindings)** :
   - Géré via LayerOps RBAC
   - Nécessite documentation des besoins de permissions

8. **NetworkPolicies** :
   - LayerOps gère le réseau différemment
   - Les politiques réseau nécessitent une adaptation

9. **HPA (HorizontalPodAutoscaler)** :
   - LayerOps a son propre système d'autoscaling
   - Les règles HPA doivent être adaptées

10. **Resources (CPU/memory limits)** :
    - LayerOps gère les ressources différemment
    - Noter pour référence mais configuration différente

11. **InitContainers** :
    - Nécessitent une adaptation
    - Les tâches d'initialisation doivent être gérées différemment

12. **Sidecars** :
    - Nécessitent une adaptation
    - Les conteneurs sidecar doivent être intégrés différemment

## Exemple d'utilisation

### Structure du chart Helm

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

### Chart.yaml

```yaml
apiVersion: v2
name: myapp
description: Mon application
version: 1.0.0
```

### values.yaml

```yaml
replicaCount: 3
image:
  repository: myregistry/api
  tag: "v1.0"
service:
  type: LoadBalancer
  port: 80
config:
  env: production
```

### templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}-api
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: api
        image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
        ports:
        - containerPort: 8080
        env:
        - name: ENV
          value: {{ .Values.config.env }}
        envFrom:
        - configMapRef:
            name: {{ .Chart.Name }}-config
```

### Spécification LayerOps générée

```json
{
  "services": [
    {
      "name": "myapp-api",
      "image": "myregistry/api:v1.0",
      "environmentId": "env-123",
      "ports": [
        {
          "containerPort": 8080,
          "hostPort": 80
        }
      ],
      "env": {
        "ENV": "production",
        "CONFIG_KEY": "value"
      },
      "replicas": 3
    }
  ],
  "deploymentOrder": ["myapp-api"]
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut fournir un chart Helm valide
- ✅ Le système parse correctement Chart.yaml, values.yaml et templates
- ✅ Toutes les ressources Kubernetes principales sont identifiées
- ✅ Les Deployments sont convertis en Services LayerOps
- ✅ Les ports sont convertis au format LayerOps
- ✅ Les variables d'environnement sont consolidées (Deployment + ConfigMaps + Secrets)
- ✅ Les valeurs Helm sont remplacées correctement
- ✅ Les dépendances sont analysées et un ordre de déploiement est créé
- ✅ Une spécification LayerOps est générée
- ✅ Si demandé, l'infrastructure est déployée automatiquement
- ✅ Un rapport de conversion avec limitations est généré
- ✅ Les erreurs de parsing sont gérées et retournées clairement

## Workflow de migration

1. **Préparation** :
   - Préparer le chart Helm (Chart.yaml, values.yaml, templates)
   - Identifier les images Docker nécessaires
   - Documenter les besoins spécifiques (volumes, ingress, etc.)

2. **Conversion** :
   - Utiliser le prompt `layerops-convert-helm`
   - Fournir les valeurs Helm personnalisées si nécessaire
   - Générer la spécification LayerOps
   - Examiner le rapport de conversion

3. **Adaptation** :
   - Gérer les volumes persistants manuellement si nécessaire
   - Adapter les configurations de routage (ingress)
   - Vérifier que toutes les images sont accessibles
   - Adapter les ressources nécessitant une attention spéciale

4. **Déploiement** :
   - Déployer l'infrastructure convertie
   - Vérifier l'état de tous les services
   - Tester les connexions entre services
   - Vérifier les variables d'environnement

5. **Validation** :
   - Vérifier que tous les services fonctionnent
   - Tester les endpoints
   - Surveiller les métriques
   - Comparer avec le comportement Kubernetes original

## Comparaison avec Docker Compose

| Aspect | Docker Compose | Helm/Kubernetes |
|--------|----------------|-----------------|
| Complexité | Simple | Complexe |
| Ressources | Services uniquement | Deployments, Services, ConfigMaps, Secrets, etc. |
| Configuration | Fichier unique | Chart avec templates |
| Variables | .env | values.yaml + templates |
| Dépendances | depends_on | Relations Kubernetes |
| Ports | Format simple | Types de services (ClusterIP, LoadBalancer, NodePort) |
| Stockage | Volumes | PersistentVolumeClaims |
| Routage | Ports exposés | Ingress |

## Documentation associée

- [Documentation des prompts](prompts.md) - Section sur la conversion Helm
- [FEATURE012 - Conversion Docker Compose](FEATURE012-conversion-docker-compose.md) - Conversion similaire pour Docker Compose
- [Documentation LayerOps](https://doc.layerops.io/) - Documentation officielle
- [Documentation Helm](https://helm.sh/docs/) - Documentation officielle Helm

