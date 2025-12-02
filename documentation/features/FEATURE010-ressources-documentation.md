# FEATURE010 - Ressources de documentation

## User Story

En tant qu'utilisateur du serveur MCP LayerOps, je souhaite pouvoir accéder à la documentation LayerOps directement via les ressources MCP afin d'obtenir de l'aide contextuelle lors de l'utilisation des outils.

## Description

Cette fonctionnalité expose les pages de documentation LayerOps sous forme de ressources MCP, permettant un accès direct à la documentation depuis le serveur MCP.

## Fonctionnalités

- **Accès à la documentation** : Accéder aux différentes sections de la documentation LayerOps
- **Ressources disponibles** : Documentation sur l'introduction, l'API, la sécurité, les instances, les services, le monitoring, le RBAC, etc.

## Ressources MCP disponibles

Le serveur expose **18 ressources de documentation** couvrant tous les aspects de LayerOps :

### Documentation générale (3 ressources)
- `layerops://docs/introduction` : Introduction à LayerOps
- `layerops://docs/api/introduction` : Introduction à l'API LayerOps
- `layerops://docs/examples` : Exemples d'applications et cas d'usage

### Gestion des ressources (6 ressources)
- `layerops://docs/projects` : Gestion et organisation des projets
- `layerops://docs/environments` : Gestion des environnements
- `layerops://docs/instances` : Gestion des instances
- `layerops://docs/pools` : Pools d'instances avec autoscaling
- `layerops://docs/services` : Gestion des services
- `layerops://docs/marketplace` : Marketplace LayerOps

### Sécurité (5 ressources)
- `layerops://docs/security/api-keys` : Clés API
- `layerops://docs/security/platform-access` : Accès aux plateformes cloud (AWS, GCP, OVH, etc.)
- `layerops://docs/security/git-repositories` : Intégration des dépôts Git
- `layerops://docs/security/docker-registries` : Configuration des registres Docker
- `layerops://docs/security/s3-buckets` : Configuration des buckets S3

### Monitoring et analytics (3 ressources)
- `layerops://docs/monitoring` : Monitoring et surveillance
- `layerops://docs/events` : Événements et audit trail
- `layerops://docs/analytics` : Analytics et analyse des coûts

### Fonctionnalités avancées (3 ressources)
- `layerops://docs/rbac` : Contrôle d'accès basé sur les rôles
- `layerops://docs/external-hosts` : Connexion d'hôtes externes
- `layerops://docs/multi-providers` : Utilisation de plusieurs fournisseurs cloud

## Exemple d'utilisation

Les ressources peuvent être lues via le protocole MCP standard :

```json
{
  "method": "resources/read",
  "params": {
    "uri": "layerops://docs/introduction"
  }
}
```

## Critères d'acceptation

- ✅ Toutes les sections principales de la documentation sont disponibles comme ressources (18 ressources)
- ✅ Les ressources couvrent tous les aspects : général, gestion, sécurité, monitoring, fonctionnalités avancées
- ✅ Les ressources sont accessibles via le protocole MCP standard
- ✅ Le contenu est formaté en Markdown pour une lecture facile
- ✅ Les ressources incluent des liens vers la documentation complète en ligne
- ✅ Chaque ressource contient un résumé détaillé des fonctionnalités correspondantes

