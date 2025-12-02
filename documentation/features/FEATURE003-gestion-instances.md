# FEATURE003 - Gestion des instances

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir gérer mes instances via le serveur MCP afin de créer, démarrer, arrêter, redémarrer et supprimer mes serveurs de manière programmatique.

## Description

Cette fonctionnalité permet la gestion complète du cycle de vie des instances LayerOps. Les instances sont les serveurs virtuels ou bare metal déployés sur la plateforme.

## Fonctionnalités

- **Liste des instances** : Récupérer la liste de toutes les instances ou celles d'un environnement
- **Détails d'une instance** : Consulter les informations détaillées d'une instance
- **Création d'instance** : Créer une nouvelle instance avec configuration personnalisée
- **Mise à jour d'instance** : Modifier les propriétés d'une instance (nom, type)
- **Contrôle d'état** : Démarrer, arrêter ou redémarrer une instance
- **Suppression d'instance** : Supprimer une instance existante

## Tools MCP

- `layerops_list_instances` : Liste les instances (optionnellement filtrées par environnement)
- `layerops_get_instance` : Récupère les détails d'une instance
- `layerops_create_instance` : Crée une nouvelle instance
- `layerops_update_instance` : Met à jour une instance
- `layerops_delete_instance` : Supprime une instance
- `layerops_start_instance` : Démarre une instance arrêtée
- `layerops_stop_instance` : Arrête une instance
- `layerops_restart_instance` : Redémarre une instance

## Exemple d'utilisation

```json
{
  "tool": "layerops_create_instance",
  "arguments": {
    "name": "web-server-01",
    "instanceType": "t2.micro",
    "region": "eu-west-1",
    "environmentId": "env-123",
    "image": "ubuntu:20.04"
  }
}
```

## Critères d'acceptation

- ✅ L'utilisateur peut lister toutes les instances
- ✅ L'utilisateur peut filtrer les instances par environnement
- ✅ L'utilisateur peut créer une instance avec tous les paramètres nécessaires
- ✅ L'utilisateur peut contrôler l'état d'une instance (démarrer, arrêter, redémarrer)
- ✅ L'utilisateur peut mettre à jour les propriétés d'une instance
- ✅ L'utilisateur peut supprimer une instance

