# FEATURE004 - Gestion des pools d'instances

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir gérer mes pools d'instances via le serveur MCP afin de créer et configurer des groupes d'instances avec autoscaling pour gérer automatiquement la charge.

## Description

Cette fonctionnalité permet la gestion des pools d'instances LayerOps. Un pool d'instances permet de gérer un groupe d'instances avec autoscaling automatique basé sur la charge.

## Fonctionnalités

- **Liste des pools** : Récupérer la liste de tous les pools ou ceux d'un environnement
- **Détails d'un pool** : Consulter les informations détaillées d'un pool
- **Création de pool** : Créer un nouveau pool avec configuration d'autoscaling
- **Mise à jour de pool** : Modifier les paramètres d'un pool (min/max instances)
- **Suppression de pool** : Supprimer un pool existant

## Tools MCP

- `layerops_list_instance_pools` : Liste les pools (optionnellement filtrés par environnement)
- `layerops_get_instance_pool` : Récupère les détails d'un pool
- `layerops_create_instance_pool` : Crée un nouveau pool avec autoscaling
- `layerops_update_instance_pool` : Met à jour un pool
- `layerops_delete_instance_pool` : Supprime un pool

## Exemple d'utilisation

```json
{
  "tool": "layerops_create_instance_pool",
  "arguments": {
    "name": "web-pool",
    "instanceType": "t2.medium",
    "minInstances": 2,
    "maxInstances": 10,
    "environmentId": "env-123",
    "autoScaling": true
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister tous les pools d'instances
- ✅ L'utilisateur peut créer un pool avec configuration d'autoscaling
- ✅ L'utilisateur peut définir le nombre minimum et maximum d'instances
- ✅ L'utilisateur peut mettre à jour les paramètres d'un pool
- ✅ L'utilisateur peut supprimer un pool

