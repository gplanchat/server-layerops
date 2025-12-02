# FEATURE011 - Authentification

## User Story

En tant qu'utilisateur du serveur MCP LayerOps, je souhaite que l'authentification soit gérée de manière sécurisée et flexible, avec support actuel des tokens API et préparation pour OAuth2.

## Description

Cette fonctionnalité gère l'authentification avec l'API LayerOps. Actuellement, l'authentification utilise des tokens API (Key ID + Secret), mais l'architecture est préparée pour une transition future vers OAuth2.

## Fonctionnalités

- **Authentification par token API** : Utilisation des clés API LayerOps (Key ID + Secret)
- **Architecture extensible** : Préparation pour OAuth2 avec providers d'authentification
- **Gestion des headers** : Ajout automatique des headers d'authentification aux requêtes API

## Configuration

L'authentification est configurée via les variables d'environnement :

```env
LAYEROPS_API_KEY_ID=your-key-id
LAYEROPS_API_KEY_SECRET=your-api-key-secret
```

## Format d'authentification

Les requêtes API utilisent l'en-tête :
```
X-API-KEY: <Key ID>:<API Key secret>
```

## Architecture

- **AuthProvider** : Interface pour les providers d'authentification
- **TokenAuthProvider** : Implémentation actuelle pour les tokens API
- **OAuth2AuthProvider** : Implémentation préparée pour OAuth2 (non activée)

## Critères d'acceptation

- ✅ L'authentification par token API fonctionne correctement
- ✅ Les headers d'authentification sont ajoutés automatiquement
- ✅ L'architecture permet une transition facile vers OAuth2
- ✅ Les erreurs d'authentification sont gérées et retournées clairement
- ✅ La configuration est validée au démarrage du serveur

