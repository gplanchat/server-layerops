#!/usr/bin/env node

/**
 * Serveur MCP pour LayerOps
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { LayerOpsApiClient } from './api/client.js';
import type { LayerOpsConfig } from './types/index.js';
import { DOCUMENTATION_RESOURCES } from './resources/documentation.js';
import { createTools, executeTool } from './tools/index.js';

// Configuration depuis les variables d'environnement
const config: LayerOpsConfig = {
  apiKeyId: process.env.LAYEROPS_API_KEY_ID || '',
  apiKeySecret: process.env.LAYEROPS_API_KEY_SECRET || '',
  baseUrl: process.env.LAYEROPS_API_BASE_URL || 'https://api.layerops.io',
};

// Validation de la configuration
if (!config.apiKeyId || !config.apiKeySecret) {
  console.error('Erreur: LAYEROPS_API_KEY_ID et LAYEROPS_API_KEY_SECRET doivent être définis');
  process.exit(1);
}

// Initialisation du client API
const apiClient = new LayerOpsApiClient(config);

// Création du serveur MCP
const server = new Server(
  {
    name: 'layerops-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Liste des ressources (documentation)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: DOCUMENTATION_RESOURCES.map((resource) => ({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    })),
  };
});

// Lecture d'une ressource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = DOCUMENTATION_RESOURCES.find((r) => r.uri === request.params.uri);
  if (!resource) {
    throw new Error(`Ressource non trouvée: ${request.params.uri}`);
  }
  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: resource.mimeType,
        text: resource.content,
      },
    ],
  };
});

// Liste des tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = createTools(apiClient);
  return {
    tools: tools.map((tool) => {
      // MCP Inspector valide les schémas avec Zod côté client et attend un JSON Schema
      // avec type: "object" à la racine. Il faut convertir les schémas Zod en JSON Schema.
      const jsonSchema = zodToJsonSchema(tool.inputSchema as any, {
        name: tool.name,
        target: 'jsonSchema7',
      }) as any;
      
      // Construire le schéma final en format JSON Schema strict
      // MCP Inspector valide avec Zod et attend exactement: { type: "object", properties: {...}, ... }
      // Il faut s'assurer que c'est un objet JSON Schema pur, pas un objet Zod
      const finalSchema = {
        type: 'object' as const,
        properties: (jsonSchema.properties || {}) as Record<string, any>,
        additionalProperties: jsonSchema.additionalProperties !== undefined 
          ? jsonSchema.additionalProperties 
          : false,
      };
      
      // Ajouter required seulement si présent et non vide
      if (jsonSchema.required && Array.isArray(jsonSchema.required) && jsonSchema.required.length > 0) {
        (finalSchema as any).required = jsonSchema.required;
      }
      
      // S'assurer que le schéma est bien sérialisé en JSON Schema pur
      // en le passant par JSON.parse/stringify pour éliminer toute référence Zod
      const cleanSchema = JSON.parse(JSON.stringify(finalSchema));
      
      return {
        name: tool.name,
        description: tool.description,
        inputSchema: cleanSchema,
      };
    }),
  };
});

// Exécution d'un tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await executeTool(apiClient, name, args || {});

    if (result.error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                error: result.error.message,
                code: result.error.code,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data || result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Gestion des erreurs
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

// Connexion au transport stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Serveur MCP LayerOps démarré');
}

main().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

