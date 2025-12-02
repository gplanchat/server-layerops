# FEATURE001 - Gestion des projets

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir gérer mes projets via le serveur MCP afin de créer, lister, consulter et supprimer mes projets de manière programmatique.

## Description

Cette fonctionnalité permet la gestion complète des projets LayerOps via le serveur MCP. Un projet est le conteneur principal qui regroupe les environnements, instances et services.

## Fonctionnalités

- **Liste des projets** : Récupérer la liste de tous les projets disponibles
- **Détails d'un projet** : Consulter les informations détaillées d'un projet spécifique
- **Création de projet** : Créer un nouveau projet avec un nom personnalisé
- **Suppression de projet** : Supprimer un projet existant (attention : cette action peut être irréversible)

## Tools MCP

- `layerops_list_projects` : Liste tous les projets
- `layerops_get_project` : Récupère les détails d'un projet
- `layerops_create_project` : Crée un nouveau projet
- `layerops_delete_project` : Supprime un projet

## Exemple d'utilisation

```json
{
  "tool": "layerops_create_project",
  "arguments": {
    "name": "Mon Nouveau Projet"
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous ses projets
- ✅ L'utilisateur peut créer un nouveau projet avec un nom unique
- ✅ L'utilisateur peut consulter les détails d'un projet existant
- ✅ L'utilisateur peut supprimer un projet (avec les précautions nécessaires)
- ✅ Les erreurs sont gérées et retournées de manière claire

