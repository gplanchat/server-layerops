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
      description: 'Liste tous les environnements ou ceux d\'un projet spécifique',
      inputSchema: z.object({
        projectId: z.string().optional().describe('ID du projet (optionnel)'),
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

    // Instances
    {
      name: 'layerops_list_instances',
      description: 'Liste toutes les instances ou celles d\'un environnement spécifique',
      inputSchema: z.object({
        environmentId: z.string().optional().describe('ID de l\'environnement (optionnel)'),
      }),
    },
    {
      name: 'layerops_get_instance',
      description: 'Récupère les détails d\'une instance spécifique',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
      }),
    },
    {
      name: 'layerops_create_instance',
      description: 'Crée une nouvelle instance',
      inputSchema: z.object({
        name: z.string().describe('Nom de l\'instance'),
        instanceType: z.string().describe('Type d\'instance (ex: t2.micro)'),
        region: z.string().describe('Région (ex: eu-west-1)'),
        environmentId: z.string().describe('ID de l\'environnement'),
        image: z.string().optional().describe('Image OS (optionnel)'),
        poolId: z.string().optional().describe('ID du pool d\'instances (optionnel)'),
      }),
    },
    {
      name: 'layerops_update_instance',
      description: 'Met à jour une instance',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
        name: z.string().optional().describe('Nouveau nom (optionnel)'),
        instanceType: z.string().optional().describe('Nouveau type (optionnel)'),
      }),
    },
    {
      name: 'layerops_delete_instance',
      description: 'Supprime une instance',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance à supprimer'),
      }),
    },
    {
      name: 'layerops_start_instance',
      description: 'Démarre une instance arrêtée',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
      }),
    },
    {
      name: 'layerops_stop_instance',
      description: 'Arrête une instance',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
      }),
    },
    {
      name: 'layerops_restart_instance',
      description: 'Redémarre une instance',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
      }),
    },

    // Instance Pools
    {
      name: 'layerops_list_instance_pools',
      description: 'Liste tous les pools d\'instances ou ceux d\'un environnement',
      inputSchema: z.object({
        environmentId: z.string().optional().describe('ID de l\'environnement (optionnel)'),
      }),
    },
    {
      name: 'layerops_get_instance_pool',
      description: 'Récupère les détails d\'un pool d\'instances',
      inputSchema: z.object({
        poolId: z.string().describe('ID du pool'),
      }),
    },
    {
      name: 'layerops_create_instance_pool',
      description: 'Crée un nouveau pool d\'instances avec autoscaling',
      inputSchema: z.object({
        name: z.string().describe('Nom du pool'),
        instanceType: z.string().describe('Type d\'instance'),
        minInstances: z.number().describe('Nombre minimum d\'instances'),
        maxInstances: z.number().describe('Nombre maximum d\'instances'),
        environmentId: z.string().describe('ID de l\'environnement'),
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
      description: 'Liste tous les services ou ceux d\'un environnement',
      inputSchema: z.object({
        environmentId: z.string().optional().describe('ID de l\'environnement (optionnel)'),
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
      description: 'Met à l\'échelle un service (change le nombre de répliques)',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service'),
        replicas: z.number().describe('Nouveau nombre de répliques'),
      }),
    },

    // Events
    {
      name: 'layerops_list_events',
      description: 'Liste les événements d\'infrastructure et de service',
      inputSchema: z.object({
        resourceType: z.string().optional().describe('Type de ressource (instance, service, etc.)'),
        resourceId: z.string().optional().describe('ID de la ressource'),
      }),
    },
    {
      name: 'layerops_get_event',
      description: 'Récupère les détails d\'un événement spécifique',
      inputSchema: z.object({
        eventId: z.string().describe('ID de l\'événement'),
      }),
    },

    // Monitoring
    {
      name: 'layerops_get_instance_monitoring',
      description: 'Récupère les données de monitoring d\'une instance',
      inputSchema: z.object({
        instanceId: z.string().describe('ID de l\'instance'),
        startTime: z.string().optional().describe('Date de début (ISO 8601)'),
        endTime: z.string().optional().describe('Date de fin (ISO 8601)'),
      }),
    },
    {
      name: 'layerops_get_service_monitoring',
      description: 'Récupère les données de monitoring d\'un service',
      inputSchema: z.object({
        serviceId: z.string().describe('ID du service'),
        startTime: z.string().optional().describe('Date de début (ISO 8601)'),
        endTime: z.string().optional().describe('Date de fin (ISO 8601)'),
      }),
    },

    // Analytics
    {
      name: 'layerops_get_analytics',
      description: 'Récupère les analytics et coûts',
      inputSchema: z.object({
        environmentId: z.string().optional().describe('ID de l\'environnement (optionnel)'),
        startTime: z.string().optional().describe('Date de début (ISO 8601)'),
        endTime: z.string().optional().describe('Date de fin (ISO 8601)'),
      }),
    },

    // RBAC
    {
      name: 'layerops_list_roles',
      description: 'Liste tous les rôles RBAC disponibles',
      inputSchema: z.object({}),
    },
    {
      name: 'layerops_get_role',
      description: 'Récupère les détails d\'un rôle RBAC',
      inputSchema: z.object({
        roleId: z.string().describe('ID du rôle'),
      }),
    },
    {
      name: 'layerops_assign_role',
      description: 'Assigne un rôle à un utilisateur sur une ressource',
      inputSchema: z.object({
        userId: z.string().describe('ID de l\'utilisateur'),
        roleId: z.string().describe('ID du rôle'),
        resourceType: z.string().describe('Type de ressource (project, environment, instance, service)'),
        resourceId: z.string().describe('ID de la ressource'),
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
    case 'layerops_get_environment':
      return await apiClient.getEnvironment(args.environmentId);
    case 'layerops_create_environment':
      return await apiClient.createEnvironment({
        name: args.name,
        projectId: args.projectId,
      });
    case 'layerops_delete_environment':
      return await apiClient.deleteEnvironment(args.environmentId);

    // Instances
    case 'layerops_list_instances':
      return await apiClient.getInstances(args.environmentId);
    case 'layerops_get_instance':
      return await apiClient.getInstance(args.instanceId);
    case 'layerops_create_instance':
      return await apiClient.createInstance({
        name: args.name,
        instanceType: args.instanceType,
        region: args.region,
        environmentId: args.environmentId,
        image: args.image,
        poolId: args.poolId,
      });
    case 'layerops_update_instance':
      return await apiClient.updateInstance(args.instanceId, {
        name: args.name,
        instanceType: args.instanceType,
      });
    case 'layerops_delete_instance':
      return await apiClient.deleteInstance(args.instanceId);
    case 'layerops_start_instance':
      return await apiClient.startInstance(args.instanceId);
    case 'layerops_stop_instance':
      return await apiClient.stopInstance(args.instanceId);
    case 'layerops_restart_instance':
      return await apiClient.restartInstance(args.instanceId);

    // Instance Pools
    case 'layerops_list_instance_pools':
      return await apiClient.getInstancePools(args.environmentId);
    case 'layerops_get_instance_pool':
      return await apiClient.getInstancePool(args.poolId);
    case 'layerops_create_instance_pool':
      return await apiClient.createInstancePool({
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
        image: args.image,
        env: args.env,
      });
    case 'layerops_delete_service':
      return await apiClient.deleteService(args.serviceId);
    case 'layerops_scale_service':
      return await apiClient.scaleService(args.serviceId, args.replicas);

    // Events
    case 'layerops_list_events':
      return await apiClient.getEvents(args.resourceType, args.resourceId);
    case 'layerops_get_event':
      return await apiClient.getEvent(args.eventId);

    // Monitoring
    case 'layerops_get_instance_monitoring':
      return await apiClient.getMonitoringData(
        args.instanceId,
        args.startTime,
        args.endTime
      );
    case 'layerops_get_service_monitoring':
      return await apiClient.getServiceMonitoring(
        args.serviceId,
        args.startTime,
        args.endTime
      );

    // Analytics
    case 'layerops_get_analytics':
      return await apiClient.getAnalytics(
        args.environmentId,
        args.startTime,
        args.endTime
      );

    // RBAC
    case 'layerops_list_roles':
      return await apiClient.getRoles();
    case 'layerops_get_role':
      return await apiClient.getRole(args.roleId);
    case 'layerops_assign_role':
      return await apiClient.assignRole(
        args.userId,
        args.roleId,
        args.resourceType,
        args.resourceId
      );

    default:
      throw new Error(`Tool inconnu: ${toolName}`);
  }
}

