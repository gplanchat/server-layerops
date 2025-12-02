# FEATURE010 - Ressources de documentation

## User Story

En tant qu'utilisateur du serveur MCP LayerOps, je souhaite pouvoir accéder à la documentation LayerOps directement via les ressources MCP afin d'obtenir de l'aide contextuelle lors de l'utilisation des outils.

## Description

Cette fonctionnalité expose les pages de documentation LayerOps sous forme de ressources MCP, permettant un accès direct à la documentation depuis le serveur MCP.

## Fonctionnalités

- **Accès à la documentation** : Accéder aux différentes sections de la documentation LayerOps
- **Ressources disponibles** : Documentation sur l'introduction, l'API, la sécurité, les instances, les services, le monitoring, le RBAC, etc.

## Ressources MCP disponibles

- `layerops://docs/introduction` : Introduction à LayerOps
- `layerops://docs/api/introduction` : Introduction à l'API LayerOps
- `layerops://docs/security/api-keys` : Documentation sur les clés API
- `layerops://docs/instances` : Gestion des instances
- `layerops://docs/services` : Gestion des services
- `layerops://docs/monitoring` : Monitoring
- `layerops://docs/rbac` : RBAC
- `layerops://docs/environments` : Gestion des environnements

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

- ✅ Toutes les sections principales de la documentation sont disponibles comme ressources
- ✅ Les ressources sont accessibles via le protocole MCP standard
- ✅ Le contenu est formaté en Markdown pour une lecture facile
- ✅ Les ressources incluent des liens vers la documentation complète en ligne

