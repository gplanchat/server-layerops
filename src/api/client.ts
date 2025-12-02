/**
 * Client API LayerOps
 */

import type { LayerOpsConfig, ApiResponse } from '../types/index.js';
import { createAuthProvider, type AuthProvider } from '../auth/index.js';

export class LayerOpsApiClient {
  private baseUrl: string;
  private authProvider: AuthProvider;

  constructor(config: LayerOpsConfig) {
    this.baseUrl = config.baseUrl || 'https://api.layerops.io';
    this.authProvider = createAuthProvider(config);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const normalizedEndpoint = endpoint.startsWith('/v1/') 
      ? endpoint 
      : endpoint.startsWith('/') 
        ? `/v1${endpoint}`
        : `/v1/${endpoint}`;
    
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.authProvider.getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        return {
          error: {
            message: errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
            code: errorData?.code || String(response.status),
          },
        };
      }

      const data = (await response.json()) as T;
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'NETWORK_ERROR',
        },
      };
    }
  }

  /**
   * Liste tous les workspaces (projets)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/workspaces
   */
  async getProjects(): Promise<ApiResponse> {
    return this.request('/workspaces');
  }

  /**
   * Récupère les détails d'un workspace (projet) spécifique
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @note GET /v1/workspaces/{workspaceUuid} n'existe pas dans Swagger. Utiliser listWorkspaces et filtrer par UUID.
   */
  async getProject(projectId: string): Promise<ApiResponse> {
    // GET direct sur /workspaces/{workspaceUuid} n'existe pas dans Swagger
    // Alternative: lister tous les workspaces et filtrer
    const allWorkspaces = await this.getProjects();
    if (allWorkspaces.error) {
      return allWorkspaces;
    }
    if (allWorkspaces.data && Array.isArray(allWorkspaces.data)) {
      const workspace = allWorkspaces.data.find((w: any) => w.uuid === projectId || w.id === projectId);
      if (workspace) {
        return { data: workspace };
      }
      return {
        error: {
          message: `Workspace ${projectId} not found`,
          code: 'NOT_FOUND',
        },
      };
    }
    return {
      error: {
        message: 'Unable to retrieve workspace details. GET /v1/workspaces/{workspaceUuid} is not available in Swagger.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  /**
   * Supprime un workspace (projet)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method DELETE
   * @url /v1/workspaces/{workspaceUuid}
   */
  async deleteProject(projectId: string): Promise<ApiResponse> {
    return this.request(`/workspaces/${projectId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Crée un nouveau workspace (projet)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method POST
   * @url /v1/workspaces
   */
  async createProject(data: { name: string }): Promise<ApiResponse> {
    return this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Liste les environnements d'un workspace
   * @param projectId - UUID du workspace (requis)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/workspaces/{workspaceUuid}/environments
   */
  async getEnvironments(projectId: string): Promise<ApiResponse> {
    if (!projectId) {
      return {
        error: {
          message: 'projectId (workspaceUuid) is required to list environments',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/workspaces/${projectId}/environments`);
  }

  /**
   * Crée un nouvel environnement
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method POST
   * @url /v1/workspaces/{workspaceUuid}/environments
   */
  async createEnvironment(data: { name: string; projectId: string }): Promise<ApiResponse> {
    return this.request(`/workspaces/${data.projectId}/environments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Récupère les détails d'un environnement spécifique
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/environments/{environmentUuid}
   */
  async getEnvironment(environmentId: string): Promise<ApiResponse> {
    return this.request(`/environments/${environmentId}`);
  }

  /**
   * Supprime un environnement
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method DELETE
   * @url /v1/environments/{environmentUuid}
   */
  async deleteEnvironment(environmentId: string): Promise<ApiResponse> {
    return this.request(`/environments/${environmentId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Liste les instance pools d'un environnement
   * @param environmentId - UUID de l'environnement (requis)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/environments/{environmentUuid}/instancePools
   */
  async getInstancePools(environmentId: string): Promise<ApiResponse> {
    if (!environmentId) {
      return {
        error: {
          message: 'environmentId is required to list instance pools',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/environments/${environmentId}/instancePools`);
  }

  /**
   * Crée un nouveau pool d'instances
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method POST
   * @url /v1/providers/{providerUuid}/instancePools
   */
  async createInstancePool(data: { providerUuid: string; [key: string]: any }): Promise<ApiResponse> {
    if (!data.providerUuid) {
      return {
        error: {
          message: 'providerUuid is required to create an instance pool',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/providers/${data.providerUuid}/instancePools`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Récupère les détails d'un pool d'instances spécifique
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/instancePools/{instancePoolUuid}
   */
  async getInstancePool(poolId: string): Promise<ApiResponse> {
    return this.request(`/instancePools/${poolId}`);
  }

  /**
   * Met à jour un pool d'instances
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method PUT
   * @url /v1/instancePools/{instancePoolUuid}
   */
  async updateInstancePool(poolId: string, data: any): Promise<ApiResponse> {
    return this.request(`/instancePools/${poolId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime un pool d'instances
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method DELETE
   * @url /v1/instancePools/{instancePoolUuid}
   */
  async deleteInstancePool(poolId: string): Promise<ApiResponse> {
    return this.request(`/instancePools/${poolId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Liste les services d'un environnement
   * @param environmentId - UUID de l'environnement (requis)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/environments/{environmentUuid}/services
   */
  async getServices(environmentId: string): Promise<ApiResponse> {
    if (!environmentId) {
      return {
        error: {
          message: 'environmentId is required to list services',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/environments/${environmentId}/services`);
  }

  /**
   * Crée un nouveau service
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method POST
   * @url /v1/environments/{environmentUuid}/services
   */
  async createService(data: { environmentId: string; [key: string]: any }): Promise<ApiResponse> {
    if (!data.environmentId) {
      return {
        error: {
          message: 'environmentId is required to create a service',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/environments/${data.environmentId}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Récupère les détails d'un service spécifique
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/services/{serviceUuid}
   */
  async getService(serviceId: string): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`);
  }

  /**
   * Met à jour un service
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method PUT
   * @url /v1/services/{serviceUuid}
   */
  async updateService(serviceId: string, data: any): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour le nombre de répliques d'un service (scaling)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method PUT
   * @url /v1/services/{serviceUuid}
   */
  async scaleService(serviceId: string, countMin: number, countMax: number): Promise<ApiResponse> {
    return this.updateService(serviceId, { countMin, countMax });
  }

  /**
   * Supprime un service
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method DELETE
   * @url /v1/services/{serviceUuid}
   */
  async deleteService(serviceId: string): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Liste les événements d'une ressource
   * @param resourceType - Type de ressource: 'environment', 'service', ou 'instancePool'
   * @param resourceId - UUID de la ressource
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/environments/{environmentUuid}/events | /v1/services/{serviceUuid}/events | /v1/instancePools/{instancePoolUuid}/events
   */
  async getEvents(resourceType: 'environment' | 'service' | 'instancePool', resourceId: string): Promise<ApiResponse> {
    if (resourceType === 'environment') {
      return this.request(`/environments/${resourceId}/events`);
    }
    if (resourceType === 'service') {
      return this.request(`/services/${resourceId}/events`);
    }
    if (resourceType === 'instancePool') {
      return this.request(`/instancePools/${resourceId}/events`);
    }
    return {
      error: {
        message: 'resourceType must be environment, service, or instancePool',
        code: 'VALIDATION_ERROR',
      },
    };
  }

  /**
   * Récupère un événement spécifique
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/events/{eventUuid} (si disponible) ou via les endpoints de ressource
   */
  async getEvent(resourceType: 'environment' | 'service' | 'instancePool', resourceId: string, eventId?: string): Promise<ApiResponse> {
    // Si eventId est fourni, essayer de récupérer l'événement spécifique
    // Sinon, lister tous les événements et filtrer
    const eventsResponse = await this.getEvents(resourceType, resourceId);
    if (eventsResponse.error) {
      return eventsResponse;
    }
    if (eventId && eventsResponse.data) {
      const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
      const event = events.find((e: any) => e.id === eventId || e.uuid === eventId);
      if (event) {
        return { data: event };
      }
      return {
        error: {
          message: `Event ${eventId} not found`,
          code: 'NOT_FOUND',
        },
      };
    }
    return eventsResponse;
  }

  /**
   * Récupère les analytics d'un environnement
   * @param environmentId - UUID de l'environnement (requis)
   * @param startTime - Date de début (ISO 8601, optionnel)
   * @param endTime - Date de fin (ISO 8601, optionnel)
   * @see {@link https://api.layerops.com/api | Documentation Swagger LayerOps}
   * @method GET
   * @url /v1/environments/{environmentUuid}/analyze
   */
  async getAnalytics(environmentId: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    if (!environmentId) {
      return {
        error: {
          message: 'environmentId is required for analytics',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    let endpoint = `/environments/${environmentId}/analyze`;
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  }

}
