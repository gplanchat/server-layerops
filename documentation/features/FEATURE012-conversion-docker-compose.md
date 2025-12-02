# FEATURE012 - Conversion Docker Compose vers LayerOps

## User Story

En tant qu'utilisateur ayant une application Docker Compose existante, je souhaite pouvoir convertir mon fichier docker-compose.yml en spécification LayerOps et déployer automatiquement l'infrastructure correspondante, afin de faciliter la migration vers LayerOps.

## Description

Cette fonctionnalité permet de convertir un fichier Docker Compose en spécification LayerOps et optionnellement de déployer l'infrastructure correspondante. Elle facilite grandement la migration d'applications existantes vers LayerOps en automatisant la conversion des configurations.

## Fonctionnalités

- **Parsing Docker Compose** : Lit et parse les fichiers docker-compose.yml (versions 2.x, 3.x)
- **Extraction de services** : Identifie tous les services définis avec leurs configurations
- **Conversion de configuration** :
  - Images Docker → images LayerOps
  - Ports Docker → format LayerOps
  - Variables d'environnement → format LayerOps
  - Dépendances (depends_on) → ordre de déploiement
- **Gestion des dépendances** : Analyse les dépendances entre services et crée un plan de déploiement ordonné
- **Génération de spécification** : Crée une spécification LayerOps au format JSON/YAML
- **Déploiement optionnel** : Peut déployer automatiquement l'infrastructure convertie
- **Rapport de conversion** : Génère un rapport détaillé avec mappings et limitations

## Prompt MCP

- `layerops-convert-docker-compose` : Convertit un fichier Docker Compose en spécification LayerOps

## Conversions supportées

### Ports
- Format Docker : `"8080:80"` → Format LayerOps : `[{containerPort: 80, hostPort: 8080}]`
- Format Docker : `"80"` → Format LayerOps : `[{containerPort: 80}]`
- Format Docker : `[8080, "9090:90"]` → Format LayerOps : `[{containerPort: 8080}, {containerPort: 90, hostPort: 9090}]`

### Variables d'environnement
- Format Docker : `KEY=value` → Format LayerOps : `{KEY: "value"}`
- Format Docker : `KEY` (référence .env) → Résolution depuis fichier .env
- Format Docker : `${VAR}` → Résolution depuis variables d'environnement

### Dépendances
- `depends_on` → Ordre de déploiement automatique
- Configuration automatique des URLs de dépendances dans les variables d'environnement

## Limitations

### Éléments non directement supportés

1. **Volumes** :
   - LayerOps gère le stockage différemment
   - Nécessite documentation et configuration manuelle
   - Les volumes nommés doivent être configurés séparément

2. **Networks personnalisés** :
   - LayerOps utilise son propre réseau
   - Les services communiquent automatiquement
   - Les configurations réseau personnalisées nécessitent une adaptation

3. **Build context** :
   - Les services avec `build:` nécessitent une image pré-construite
   - L'image doit être disponible dans un registre Docker accessible

4. **Command/Entrypoint** :
   - Notés pour référence mais LayerOps utilise l'image telle quelle
   - Les commandes personnalisées doivent être intégrées dans l'image

5. **Restart policy** :
   - LayerOps gère automatiquement la haute disponibilité
   - Les politiques de redémarrage sont gérées différemment

6. **Healthcheck** :
   - Noté pour référence
   - LayerOps a son propre système de monitoring

## Exemple d'utilisation

### Fichier Docker Compose d'entrée

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

### Spécification LayerOps générée

```json
{
  "services": [
    {
      "name": "db",
      "image": "postgres:14",
      "environmentId": "env-123",
      "env": {
        "POSTGRES_DB": "myapp",
        "POSTGRES_USER": "user",
        "POSTGRES_PASSWORD": "pass"
      }
    },
    {
      "name": "api",
      "image": "myapp/api:v1.0",
      "environmentId": "env-123",
      "ports": [
        {
          "containerPort": 3000
        }
      ],
      "env": {
        "DB_HOST": "db",
        "DB_PORT": "5432"
      }
    },
    {
      "name": "web",
      "image": "nginx:latest",
      "environmentId": "env-123",
      "ports": [
        {
          "containerPort": 80,
          "hostPort": 8080
        }
      ],
      "env": {
        "API_URL": "http://api"
      }
    }
  ],
  "deploymentOrder": ["db", "api", "web"]
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut fournir un fichier Docker Compose valide
- ✅ Le système parse correctement le fichier YAML
- ✅ Tous les services sont identifiés et convertis
- ✅ Les ports sont convertis au format LayerOps
- ✅ Les variables d'environnement sont converties
- ✅ Les dépendances sont analysées et un ordre de déploiement est créé
- ✅ Une spécification LayerOps est générée
- ✅ Si demandé, l'infrastructure est déployée automatiquement
- ✅ Un rapport de conversion avec limitations est généré
- ✅ Les erreurs de parsing sont gérées et retournées clairement

## Workflow de migration

1. **Préparation** :
   - Préparer le fichier docker-compose.yml
   - Préparer le fichier .env si nécessaire
   - Identifier les images Docker nécessaires

2. **Conversion** :
   - Utiliser le prompt `layerops-convert-docker-compose`
   - Générer la spécification LayerOps
   - Examiner le rapport de conversion

3. **Adaptation** :
   - Gérer les volumes manuellement si nécessaire
   - Adapter les configurations réseau si nécessaire
   - Vérifier que toutes les images sont accessibles

4. **Déploiement** :
   - Déployer l'infrastructure convertie
   - Vérifier l'état de tous les services
   - Tester les connexions entre services

5. **Validation** :
   - Vérifier que tous les services fonctionnent
   - Tester les endpoints
   - Surveiller les métriques

## Documentation associée

- [Documentation des prompts](prompts.md) - Section sur la conversion Docker Compose
- [Documentation LayerOps](https://doc.layerops.io/) - Documentation officielle

