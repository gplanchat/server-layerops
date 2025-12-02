# FEATURE007 - Monitoring

## User Story

En tant qu'utilisateur LayerOps, je souhaite pouvoir consulter les données de monitoring de mes instances et services via le serveur MCP afin de surveiller les performances et diagnostiquer les problèmes.

## Description

Cette fonctionnalité permet d'accéder aux données de monitoring LayerOps. Le monitoring est automatiquement installé pour toutes les instances et services, fournissant des métriques en temps réel.

## Fonctionnalités

- **Monitoring d'instance** : Récupérer les métriques d'une instance (CPU, mémoire, disque, réseau)
- **Monitoring de service** : Récupérer les métriques d'un service
- **Filtrage temporel** : Filtrer les données par période (début/fin)

## Tools MCP

- `layerops_get_instance_monitoring` : Récupère les données de monitoring d'une instance
- `layerops_get_service_monitoring` : Récupère les données de monitoring d'un service

## Exemple d'utilisation

```json
{
  "tool": "layerops_get_instance_monitoring",
  "arguments": {
    "instanceId": "inst-123",
    "startTime": "2024-01-01T00:00:00Z",
    "endTime": "2024-01-02T00:00:00Z"
  }
}
```

## Métriques disponibles

- **CPU** : Utilisation du processeur (%)
- **Mémoire** : Utilisation de la mémoire (MB/GB)
- **Disque** : Utilisation du disque (MB/GB)
- **Réseau** : Trafic réseau entrant/sortant (MB/s)

## Critères d'acceptation

- ✅ L'utilisateur peut récupérer les métriques d'une instance
- ✅ L'utilisateur peut récupérer les métriques d'un service
- ✅ L'utilisateur peut filtrer les données par période
- ✅ Les métriques incluent CPU, mémoire, disque et réseau

