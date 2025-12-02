# FEATURE009 - RBAC (Contrôle d'accès basé sur les rôles)

## User Story

En tant qu'administrateur LayerOps, je souhaite pouvoir gérer les rôles et permissions via le serveur MCP afin de contrôler précisément les accès aux ressources pour chaque utilisateur.

## Description

Cette fonctionnalité permet la gestion du RBAC (Role-Based Access Control) LayerOps. Le RBAC permet de définir précisément les droits d'accès pour chaque utilisateur sur chaque ressource (projet, environnement, instance, service).

## Fonctionnalités

- **Liste des rôles** : Récupérer la liste de tous les rôles disponibles
- **Détails d'un rôle** : Consulter les permissions d'un rôle spécifique
- **Assignation de rôle** : Assigner un rôle à un utilisateur sur une ressource

## Tools MCP

- `layerops_list_roles` : Liste tous les rôles RBAC disponibles
- `layerops_get_role` : Récupère les détails d'un rôle
- `layerops_assign_role` : Assigne un rôle à un utilisateur sur une ressource

## Exemple d'utilisation

```json
{
  "tool": "layerops_assign_role",
  "arguments": {
    "userId": "user-123",
    "roleId": "role-456",
    "resourceType": "environment",
    "resourceId": "env-789"
  }
}
```

## Types de ressources

- `project` : Projet
- `environment` : Environnement
- `instance` : Instance
- `service` : Service

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous les rôles disponibles
- ✅ L'utilisateur peut consulter les permissions d'un rôle
- ✅ L'utilisateur peut assigner un rôle à un utilisateur sur une ressource
- ✅ Les assignations peuvent être faites au niveau projet, environnement, instance ou service

