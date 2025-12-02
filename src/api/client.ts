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
    // S'assurer que l'endpoint commence par /v1/ selon la définition Swagger
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

  // Workspaces (appelés "projects" dans l'interface mais "workspaces" dans l'API selon Swagger)
  async getProjects(): Promise<ApiResponse> {
    return this.request('/workspaces');
  }

  async getProject(projectId: string): Promise<ApiResponse> {
    return this.request(`/workspaces/${projectId}`);
  }

  async createProject(data: { name: string }): Promise<ApiResponse> {
    return this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(projectId: string): Promise<ApiResponse> {
    return this.request(`/workspaces/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Environments
  async getEnvironments(projectId?: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/workspaces/{workspaceUuid}/environments
    const endpoint = projectId ? `/workspaces/${projectId}/environments` : '/environments';
    return this.request(endpoint);
  }

  async getEnvironment(environmentId: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/environments/{environmentUuid}
    return this.request(`/environments/${environmentId}`);
  }

  async createEnvironment(data: { name: string; projectId: string }): Promise<ApiResponse> {
    // Selon Swagger: POST /v1/workspaces/{workspaceUuid}/environments
    return this.request(`/workspaces/${data.projectId}/environments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteEnvironment(environmentId: string): Promise<ApiResponse> {
    // Selon Swagger: DELETE /v1/environments/{environmentUuid}
    return this.request(`/environments/${environmentId}`, {
      method: 'DELETE',
    });
  }

  // Instances
  // Note: Selon Swagger, les instances sont gérées via les instance pools
  // Il n'y a pas d'endpoint direct /instances dans Swagger
  // Ces méthodes sont conservées pour compatibilité mais peuvent ne pas fonctionner
  async getInstances(environmentId?: string): Promise<ApiResponse> {
    // Pas d'endpoint direct dans Swagger - utiliser les instance pools
    const endpoint = environmentId ? `/environments/${environmentId}/instancePools` : '/instancePools';
    return this.request(endpoint);
  }

  async getInstance(instanceId: string): Promise<ApiResponse> {
    // Pas d'endpoint direct dans Swagger - utiliser les instance pools
    return this.request(`/instancePools/${instanceId}`);
  }

  async createInstance(data: any): Promise<ApiResponse> {
    // Selon Swagger: POST /v1/environments/{environmentUuid}/instancePools
    if (!data.environmentId) {
      return {
        error: {
          message: 'environmentId is required to create an instance pool',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/environments/${data.environmentId}/instancePools`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInstance(instanceId: string, data: any): Promise<ApiResponse> {
    // Selon Swagger: PATCH /v1/instancePools/{instancePoolUuid}
    return this.request(`/instancePools/${instanceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteInstance(instanceId: string): Promise<ApiResponse> {
    // Selon Swagger: DELETE /v1/instancePools/{instancePoolUuid}
    return this.request(`/instancePools/${instanceId}`, {
      method: 'DELETE',
    });
  }

  async startInstance(instanceId: string): Promise<ApiResponse> {
    // Pas d'endpoint direct dans Swagger - peut-être via instance pools
    return {
      error: {
        message: 'Start instance endpoint not found in Swagger. Use instance pools instead.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  async stopInstance(instanceId: string): Promise<ApiResponse> {
    // Pas d'endpoint direct dans Swagger - peut-être via instance pools
    return {
      error: {
        message: 'Stop instance endpoint not found in Swagger. Use instance pools instead.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  async restartInstance(instanceId: string): Promise<ApiResponse> {
    // Pas d'endpoint direct dans Swagger - peut-être via instance pools
    return {
      error: {
        message: 'Restart instance endpoint not found in Swagger. Use instance pools instead.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  // Instance Pools
  async getInstancePools(environmentId?: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/environments/{environmentUuid}/instancePools
    const endpoint = environmentId ? `/environments/${environmentId}/instancePools` : '/instancePools';
    return this.request(endpoint);
  }

  async getInstancePool(poolId: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/instancePools/{instancePoolUuid}
    return this.request(`/instancePools/${poolId}`);
  }

  async createInstancePool(data: any): Promise<ApiResponse> {
    // Selon Swagger: POST /v1/environments/{environmentUuid}/instancePools
    if (!data.environmentId) {
      return {
        error: {
          message: 'environmentId is required to create an instance pool',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    return this.request(`/environments/${data.environmentId}/instancePools`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInstancePool(poolId: string, data: any): Promise<ApiResponse> {
    // Selon Swagger: PATCH /v1/instancePools/{instancePoolUuid}
    return this.request(`/instancePools/${poolId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteInstancePool(poolId: string): Promise<ApiResponse> {
    // Selon Swagger: DELETE /v1/instancePools/{instancePoolUuid}
    return this.request(`/instancePools/${poolId}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices(environmentId?: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/environments/{environmentUuid}/services
    const endpoint = environmentId ? `/environments/${environmentId}/services` : '/services';
    return this.request(endpoint);
  }

  async getService(serviceId: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/services/{serviceUuid}
    return this.request(`/services/${serviceId}`);
  }

  async createService(data: any): Promise<ApiResponse> {
    // Selon Swagger: POST /v1/environments/{environmentUuid}/services
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

  async updateService(serviceId: string, data: any): Promise<ApiResponse> {
    // Selon Swagger: PATCH /v1/services/{serviceUuid}
    return this.request(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteService(serviceId: string): Promise<ApiResponse> {
    // Selon Swagger: DELETE /v1/services/{serviceUuid}
    return this.request(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  async scaleService(serviceId: string, replicas: number): Promise<ApiResponse> {
    // Selon Swagger: PATCH /v1/services/{serviceUuid} avec countMin/countMax
    // Pas d'endpoint /scale direct - utiliser updateService avec countMin/countMax
    return this.updateService(serviceId, { countMin: replicas, countMax: replicas });
  }

  // Events
  async getEvents(resourceType?: string, resourceId?: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/environments/{environmentUuid}/events
    // ou GET /v1/services/{serviceUuid}/events
    // ou GET /v1/instancePools/{instancePoolUuid}/events
    if (resourceType === 'environment' && resourceId) {
      return this.request(`/environments/${resourceId}/events`);
    }
    if (resourceType === 'service' && resourceId) {
      return this.request(`/services/${resourceId}/events`);
    }
    if (resourceType === 'instancePool' && resourceId) {
      return this.request(`/instancePools/${resourceId}/events`);
    }
    // Si aucun type spécifique, retourner une erreur car il faut un contexte
    return {
      error: {
        message: 'resourceType and resourceId are required. Use environment, service, or instancePool.',
        code: 'VALIDATION_ERROR',
      },
    };
  }

  async getEvent(eventId: string): Promise<ApiResponse> {
    // Pas d'endpoint direct /events/{eventId} dans Swagger
    // Les événements sont récupérés via les ressources parentes
    return {
      error: {
        message: 'Event endpoint not found in Swagger. Use getEvents with resourceType and resourceId.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  // Monitoring
  async getMonitoringData(instanceId: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    // Selon Swagger: Les données de monitoring sont sous /v1/environments/{environmentUuid}/monitoring/*
    // Pas d'endpoint direct /monitoring/instances/{instanceId}
    // Utiliser les instance pools ou les services pour le monitoring
    return {
      error: {
        message: 'Monitoring endpoint for instances not found in Swagger. Use environment or service monitoring instead.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  async getServiceMonitoring(serviceId: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    // Selon Swagger: Les données de monitoring sont sous /v1/environments/{environmentUuid}/monitoring/*
    // Pas d'endpoint direct /monitoring/services/{serviceId}
    // Utiliser l'environnement parent pour le monitoring
    return {
      error: {
        message: 'Monitoring endpoint for services not found in Swagger. Use environment monitoring instead.',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  // Analytics
  async getAnalytics(environmentId?: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    // Selon Swagger: GET /v1/environments/{environmentUuid}/analyze
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

  // RBAC
  // Note: Les endpoints RBAC ne sont pas présents dans le Swagger analysé
  // Ces méthodes sont conservées pour compatibilité mais peuvent ne pas fonctionner
  async getRoles(): Promise<ApiResponse> {
    // Pas d'endpoint /rbac/roles dans Swagger
    return {
      error: {
        message: 'RBAC roles endpoint not found in Swagger',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  async getRole(roleId: string): Promise<ApiResponse> {
    // Pas d'endpoint /rbac/roles/{roleId} dans Swagger
    return {
      error: {
        message: 'RBAC role endpoint not found in Swagger',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }

  async assignRole(userId: string, roleId: string, resourceType: string, resourceId: string): Promise<ApiResponse> {
    // Pas d'endpoint /rbac/assignments dans Swagger
    return {
      error: {
        message: 'RBAC assignments endpoint not found in Swagger',
        code: 'NOT_IMPLEMENTED',
      },
    };
  }
}

