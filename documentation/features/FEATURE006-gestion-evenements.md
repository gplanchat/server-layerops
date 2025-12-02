# FEATURE006 - Gestion des événements

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir consulter les événements d'infrastructure et de service via le serveur MCP afin de suivre l'historique des actions et diagnostiquer les problèmes.

## Description

Cette fonctionnalité permet de consulter les événements LayerOps. Les événements fournissent un audit trail complet de toutes les actions effectuées sur l'infrastructure et les services.

## Fonctionnalités

- **Liste des événements** : Récupérer la liste des événements avec filtres optionnels
- **Détails d'un événement** : Consulter les informations détaillées d'un événement spécifique
- **Filtrage** : Filtrer les événements par type de ressource ou ID de ressource

## Tools MCP

- `layerops_list_events` : Liste les événements (optionnellement filtrés par type ou ID de ressource)
- `layerops_get_event` : Récupère les détails d'un événement

## Exemple d'utilisation

```json
{
  "tool": "layerops_list_events",
  "arguments": {
    "resourceType": "instance",
    "resourceId": "inst-123"
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous les événements
- ✅ L'utilisateur peut filtrer les événements par type de ressource
- ✅ L'utilisateur peut filtrer les événements par ID de ressource
- ✅ L'utilisateur peut consulter les détails d'un événement spécifique
- ✅ Les événements incluent les informations de timestamp et de sévérité

