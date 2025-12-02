# FEATURE002 - Gestion des environnements

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir gérer mes environnements via le serveur MCP afin d'organiser et isoler mes ressources (développement, staging, production).

## Description

Cette fonctionnalité permet la gestion complète des environnements LayerOps. Un environnement permet d'isoler les ressources et services dans un contexte spécifique (développement, staging, production, etc.).

## Fonctionnalités

- **Liste des environnements** : Récupérer la liste de tous les environnements ou ceux d'un projet spécifique
- **Détails d'un environnement** : Consulter les informations détaillées d'un environnement
- **Création d'environnement** : Créer un nouvel environnement dans un projet
- **Suppression d'environnement** : Supprimer un environnement existant

## Tools MCP

- `layerops_list_environments` : Liste les environnements (optionnellement filtrés par projet)
- `layerops_get_environment` : Récupère les détails d'un environnement
- `layerops_create_environment` : Crée un nouvel environnement
- `layerops_delete_environment` : Supprime un environnement

## Exemple d'utilisation

```json
{
  "tool": "layerops_create_environment",
  "arguments": {
    "name": "Production",
    "projectId": "proj-123"
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous les environnements
- ✅ L'utilisateur peut filtrer les environnements par projet
- ✅ L'utilisateur peut créer un nouvel environnement dans un projet
- ✅ L'utilisateur peut consulter les détails d'un environnement
- ✅ L'utilisateur peut supprimer un environnement

