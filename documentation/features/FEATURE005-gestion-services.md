# FEATURE005 - Gestion des services

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir déployer et gérer mes services via le serveur MCP afin de déployer des applications depuis des images Docker et les mettre à l'échelle selon mes besoins.

## Description

Cette fonctionnalité permet la gestion complète des services LayerOps. Les services sont des applications déployées depuis des images Docker (publiques ou privées) ou depuis la marketplace LayerOps.

## Fonctionnalités

- **Liste des services** : Récupérer la liste de tous les services ou ceux d'un environnement
- **Détails d'un service** : Consulter les informations détaillées d'un service
- **Création de service** : Déployer un nouveau service depuis une image Docker
- **Mise à jour de service** : Modifier la configuration d'un service (image, variables d'environnement)
- **Mise à l'échelle** : Changer le nombre de répliques d'un service
- **Suppression de service** : Supprimer un service existant

## Tools MCP

- `layerops_list_services` : Liste les services (optionnellement filtrés par environnement)
- `layerops_get_service` : Récupère les détails d'un service
- `layerops_create_service` : Crée un nouveau service depuis une image Docker
- `layerops_update_service` : Met à jour un service
- `layerops_scale_service` : Met à l'échelle un service (change le nombre de répliques)
- `layerops_delete_service` : Supprime un service

## Exemple d'utilisation

```json
{
  "tool": "layerops_create_service",
  "arguments": {
    "name": "api-service",
    "image": "nginx:latest",
    "environmentId": "env-123",
    "ports": [
      {
        "containerPort": 80,
        "hostPort": 8080
      }
    ],
    "env": {
      "NODE_ENV": "production"
    },
    "replicas": 3
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous les services
- ✅ L'utilisateur peut déployer un service depuis une image Docker
- ✅ L'utilisateur peut configurer les ports exposés
- ✅ L'utilisateur peut définir des variables d'environnement
- ✅ L'utilisateur peut mettre à l'échelle un service (changer le nombre de répliques)
- ✅ L'utilisateur peut mettre à jour la configuration d'un service
- ✅ L'utilisateur peut supprimer un service

