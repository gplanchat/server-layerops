# Architecture du serveur MCP LayerOps

Ce document décrit l'architecture du serveur MCP pour LayerOps.

## Vue d'ensemble

Le serveur MCP LayerOps est construit en TypeScript et utilise le SDK MCP officiel (`@modelcontextprotocol/sdk`). Il expose les fonctionnalités de l'API LayerOps via le protocole MCP.

## Structure des modules

### 1. Point d'entrée (`src/index.ts`)

Le point d'entrée du serveur :
- Initialise la configuration depuis les variables d'environnement
- Crée le serveur MCP avec les capacités (resources, tools)
- Configure les handlers pour les requêtes MCP
- Gère les erreurs et le transport stdio

### 2. Client API (`src/api/client.ts`)

Le client API LayerOps :
- Gère toutes les requêtes HTTP vers l'API LayerOps
- Implémente tous les endpoints disponibles
- Gère les erreurs et les réponses
- Utilise le provider d'authentification pour les headers

### 3. Authentification (`src/auth/index.ts`)

Système d'authentification flexible :
- **TokenAuthProvider** : Implémentation actuelle pour les tokens API
- **OAuth2AuthProvider** : Préparation pour OAuth2 (non activée)
- **Factory** : Crée le provider approprié selon la configuration

### 4. Tools (`src/tools/index.ts`)

Définition et exécution des tools MCP :
- **createTools()** : Crée la liste de tous les tools avec leurs schémas Zod
- **executeTool()** : Exécute un tool en appelant le client API approprié
- Plus de 30 tools couvrant toutes les fonctionnalités LayerOps

### 5. Ressources (`src/resources/documentation.ts`)

Ressources MCP pour la documentation :
- Expose les pages de documentation LayerOps comme ressources MCP
- Format Markdown pour une lecture facile
- Accessible via le protocole MCP standard

### 6. Prompts (`src/prompts/index.ts`)

Prompts pour la gestion de l'infrastructure :
- Prompts prédéfinis pour des workflows complexes
- Documentation dans `documentation/prompts.md`

### 7. Types (`src/types/index.ts`)

Définitions TypeScript :
- Types pour les requêtes/réponses API
- Types pour les ressources LayerOps
- Interfaces pour la configuration

## Flux de données

```
Client MCP
    ↓
Serveur MCP (src/index.ts)
    ↓
Tools Handler / Resources Handler
    ↓
Client API (src/api/client.ts)
    ↓
Auth Provider (src/auth/index.ts)
    ↓
API LayerOps (HTTPS)
```

## Authentification

### Actuel : Tokens API

Les requêtes utilisent l'en-tête :
```
X-API-KEY: <Key ID>:<API Key secret>
```

### Futur : OAuth2

L'architecture est préparée pour OAuth2 :
- Interface `AuthProvider` abstraite
- Implémentation `OAuth2AuthProvider` prête (non activée)
- Transition facile en changeant le provider

## Gestion des erreurs

- **Erreurs réseau** : Capturées et retournées avec code `NETWORK_ERROR`
- **Erreurs API** : Retournées avec le message et le code HTTP
- **Erreurs de validation** : Gérées par Zod dans les schémas
- **Erreurs MCP** : Loggées et propagées au client

## Extensibilité

Le serveur est conçu pour être extensible :

1. **Nouveaux tools** : Ajouter dans `src/tools/index.ts`
2. **Nouveaux endpoints API** : Ajouter dans `src/api/client.ts`
3. **Nouvelles ressources** : Ajouter dans `src/resources/documentation.ts`
4. **Nouveaux types** : Ajouter dans `src/types/index.ts`

## Tests avec MCP Inspector

MCP Inspector permet de :
- Tester tous les tools individuellement
- Consulter les ressources
- Voir les réponses en temps réel
- Déboguer les problèmes

Voir [MCP_INSPECTOR.md](MCP_INSPECTOR.md) pour plus de détails.

## Sécurité

- Les credentials ne sont jamais loggés
- Validation des entrées avec Zod
- Gestion sécurisée des tokens
- Support pour OAuth2 (futur)

## Performance

- Requêtes asynchrones avec async/await
- Pas de cache (chaque requête est fraîche)
- Gestion efficace des erreurs
- Transport stdio pour performance optimale

