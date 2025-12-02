/**
 * Tools MCP pour LayerOps
 */

import { z } from 'zod';
import type { LayerOpsApiClient } from '../api/client.js';

export function createTools(apiClient: LayerOpsApiClient) {
  return [
    // Projects
    {
      name: 'layerops_list_projects',
      description: 'Liste tous les projets LayerOps',
      inputSchema: z.object({}),
    },
    {
      name: 'layerops_get_project',
      description: 'Récupère les détails d\'un projet spécifique',
      inputSchema: z.object({
        projectId: z.string().describe('ID du projet'),
      }),
    },
    {
      name: 'layerops_create_project',
      description: 'Crée un nouveau projet',
      inputSchema: z.object({
        name: z.string().describe('Nom du projet'),
      }),
    },
    {
      name: 'layerops_delete_project',
      description: 'Supprime un projet',
      inputSchema: z.object({
        projectId: z.string().describe('ID du projet à supprimer'),
      }),
    },

    // Environments
    {
      name: 'layerops_list_environments',
      description: 'Liste les environnements d\'un projet',
      inputSchema: z.object({
        projectId: z.string().describe('ID du projet'),
      }),
    },
    {
      name: 'layerops_get_environment',
      description: 'Récupère les détails d\'un environnement spécifique',
      inputSchema: z.object({
        environmentId: z.string().describe('ID de l\'environnement'),
      }),
    },
    {
      name: 'layerops_create_environment',
      description: 'Crée un nouvel environnement',
      inputSchema: z.object({
        name: z.string().describe('Nom de l\'environnement'),
        projectId: z.string().describe('ID du projet parent'),
      }),
    },
    {
      name: 'layerops_delete_environment',
      description: 'Supprime un environnement',
      inputSchema: z.object({
        environmentId: z.string().describe('ID de l\'environnement à supprimer'),
      }),
    },

    // Instance Pools
    {
      name: 'layerops_list_instance_pools',
      description: 'Liste les pools d\'instances d\'un environnement',
      inputSchema: z.object({
        environmentId: z.string().describe('ID de l\'environnement'),
      }),
    },
    {
      name: 'layerops_get_instance_pool',
      description: 'Récupère les détails d\'un pool d\'instances spécifique',
      inputSchema: z.object({
        poolId: z.string().describe('ID du pool'),
      }),
    },
    {
      name: 'layerops_create_instance_pool',
      description: 'Crée un nouveau pool d\'instances avec autoscaling',
      inputSchema: z.object({
        providerUuid: z.string().describe('UUID du provider'),
        name: z.string().describe('Nom du pool'),
        instanceType: z.string().describe('Type d\'instance'),
        minInstances: z.number().optional().describe('Nombre minimum d\'instances (optionnel)'),
        maxInstances: z.number().optional().describe('Nombre maximum d\'instances (optionnel)'),
        environmentId: z.string().optional().describe('ID de l\'environnement (optionnel)'),
        autoScaling: z.boolean().optional().describe('Activer l\'autoscaling (optionnel)'),
      }),
    },
    {
      name: 'layerops_update_instance_pool',
      description: 'Met à jour un pool d\'instances',
      inputSchema: z.object({
        poolId: z.string().describe('ID du pool'),
        minInstances: z.number().optional().describe('Nouveau minimum (optionnel)'),
        maxInstances: z.number().optional().describe('Nouveau maximum (optionnel)'),
      }),
    },
    {
      name: 'layerops_delete_instance_pool',
      description: 'Supprime un pool d\'instances',
      inputSchema: z.object({
        poolId: z.string().describe('ID du pool à supprimer'),
      }),
    },

    // Services
    {
      name: 'layerops_list_services',
      description: 'Liste les services d\'un environnement',
      inputSchema: z.object({
        environmentId: z.string().describe('ID de l\'environnement'),
      }),
    },
    {
      name: 'layerops_get_service',
      description: 'Récupère les détails d\'un service spécifique',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service'),
      }),
    },
    {
      name: 'layerops_create_service',
      description: 'Crée un nouveau service depuis une image Docker',
      inputSchema: z.object({
        name: z.string().describe('Nom du service'),
        image: z.string().describe('Image Docker (ex: nginx:latest)'),
        environmentId: z.string().describe('ID de l\'environnement'),
        ports: z.array(z.object({
          containerPort: z.number(),
          hostPort: z.number().optional(),
        })).optional().describe('Ports à exposer (optionnel)'),
        env: z.record(z.string()).optional().describe('Variables d\'environnement (optionnel)'),
        replicas: z.number().optional().describe('Nombre de répliques (optionnel)'),
      }),
    },
    {
      name: 'layerops_update_service',
      description: 'Met à jour un service',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service'),
        name: z.string().optional().describe('Nouveau nom (optionnel)'),
        image: z.string().optional().describe('Nouvelle image (optionnel)'),
        env: z.record(z.string()).optional().describe('Nouvelles variables d\'environnement (optionnel)'),
      }),
    },
    {
      name: 'layerops_delete_service',
      description: 'Supprime un service',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service à supprimer'),
      }),
    },
    {
      name: 'layerops_scale_service',
      description: 'Met à jour le nombre de répliques d\'un service',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service'),
        countMin: z.number().describe('Nombre minimum de répliques'),
        countMax: z.number().describe('Nombre maximum de répliques'),
      }),
    },

    // Events
    {
      name: 'layerops_list_events',
      description: 'Liste les événements d\'une ressource',
      inputSchema: z.object({
        resourceType: z.enum(['environment', 'service', 'instancePool']).describe('Type de ressource'),
        resourceId: z.string().describe('ID de la ressource'),
      }),
    },
    {
      name: 'layerops_get_event',
      description: 'Récupère un événement spécifique',
      inputSchema: z.object({
        resourceType: z.enum(['environment', 'service', 'instancePool']).describe('Type de ressource'),
        resourceId: z.string().describe('ID de la ressource'),
        eventId: z.string().optional().describe('ID de l\'événement (optionnel, sinon retourne tous les événements)'),
      }),
    },

    // Monitoring
    // Analytics
    {
      name: 'layerops_get_analytics',
      description: 'Récupère les analytics et coûts d\'un environnement',
      inputSchema: z.object({
        environmentId: z.string().describe('ID de l\'environnement'),
        startTime: z.string().optional().describe('Date de début (ISO 8601)'),
        endTime: z.string().optional().describe('Date de fin (ISO 8601)'),
      }),
    },

  ];
}

export async function executeTool(
  apiClient: LayerOpsApiClient,
  toolName: string,
  args: any
): Promise<any> {
  switch (toolName) {
    // Projects
    case 'layerops_list_projects':
      return await apiClient.getProjects();
    case 'layerops_get_project':
      return await apiClient.getProject(args.projectId);
    case 'layerops_create_project':
      return await apiClient.createProject({ name: args.name });
    case 'layerops_delete_project':
      return await apiClient.deleteProject(args.projectId);

    // Environments
    case 'layerops_list_environments':
      return await apiClient.getEnvironments(args.projectId);
    case 'layerops_create_environment':
      return await apiClient.createEnvironment({
        name: args.name,
        projectId: args.projectId,
      });
    case 'layerops_delete_environment':
      return await apiClient.deleteEnvironment(args.environmentId);

    // Instance Pools
    case 'layerops_list_instance_pools':
      return await apiClient.getInstancePools(args.environmentId);
    case 'layerops_get_instance_pool':
      return await apiClient.getInstancePool(args.poolId);
    case 'layerops_create_instance_pool':
      return await apiClient.createInstancePool({
        providerUuid: args.providerUuid,
        name: args.name,
        instanceType: args.instanceType,
        minInstances: args.minInstances,
        maxInstances: args.maxInstances,
        environmentId: args.environmentId,
        autoScaling: args.autoScaling,
      });
    case 'layerops_update_instance_pool':
      return await apiClient.updateInstancePool(args.poolId, {
        minInstances: args.minInstances,
        maxInstances: args.maxInstances,
      });
    case 'layerops_delete_instance_pool':
      return await apiClient.deleteInstancePool(args.poolId);

    // Services
    case 'layerops_list_services':
      return await apiClient.getServices(args.environmentId);
    case 'layerops_get_service':
      return await apiClient.getService(args.serviceId);
    case 'layerops_create_service':
      return await apiClient.createService({
        name: args.name,
        image: args.image,
        environmentId: args.environmentId,
        ports: args.ports,
        env: args.env,
        replicas: args.replicas,
      });
    case 'layerops_update_service':
      return await apiClient.updateService(args.serviceId, {
        name: args.name,
        image: args.image,
        env: args.env,
      });
    case 'layerops_delete_service':
      return await apiClient.deleteService(args.serviceId);
    case 'layerops_scale_service':
      return await apiClient.scaleService(args.serviceId, args.countMin, args.countMax);

    // Events
    case 'layerops_list_events':
      return await apiClient.getEvents(args.resourceType, args.resourceId);
    case 'layerops_get_event':
      return await apiClient.getEvent(args.resourceType, args.resourceId, args.eventId);

    // Analytics
    case 'layerops_get_analytics':
      return await apiClient.getAnalytics(
        args.environmentId,
        args.startTime,
        args.endTime
      );

    default:
      throw new Error(`Tool inconnu: ${toolName}`);
  }
}

