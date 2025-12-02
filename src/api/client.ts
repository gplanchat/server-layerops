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
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.authProvider.getAuthHeaders(),
      ...options.headers,
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

  // Projects
  async getProjects(): Promise<ApiResponse> {
    return this.request('/projects');
  }

  async getProject(projectId: string): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}`);
  }

  async createProject(data: { name: string }): Promise<ApiResponse> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(projectId: string): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Environments
  async getEnvironments(projectId?: string): Promise<ApiResponse> {
    const endpoint = projectId ? `/projects/${projectId}/environments` : '/environments';
    return this.request(endpoint);
  }

  async getEnvironment(environmentId: string): Promise<ApiResponse> {
    return this.request(`/environments/${environmentId}`);
  }

  async createEnvironment(data: { name: string; projectId: string }): Promise<ApiResponse> {
    return this.request('/environments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteEnvironment(environmentId: string): Promise<ApiResponse> {
    return this.request(`/environments/${environmentId}`, {
      method: 'DELETE',
    });
  }

  // Instances
  async getInstances(environmentId?: string): Promise<ApiResponse> {
    const endpoint = environmentId ? `/environments/${environmentId}/instances` : '/instances';
    return this.request(endpoint);
  }

  async getInstance(instanceId: string): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}`);
  }

  async createInstance(data: any): Promise<ApiResponse> {
    return this.request('/instances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInstance(instanceId: string, data: any): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteInstance(instanceId: string): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}`, {
      method: 'DELETE',
    });
  }

  async startInstance(instanceId: string): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}/start`, {
      method: 'POST',
    });
  }

  async stopInstance(instanceId: string): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}/stop`, {
      method: 'POST',
    });
  }

  async restartInstance(instanceId: string): Promise<ApiResponse> {
    return this.request(`/instances/${instanceId}/restart`, {
      method: 'POST',
    });
  }

  // Instance Pools
  async getInstancePools(environmentId?: string): Promise<ApiResponse> {
    const endpoint = environmentId ? `/environments/${environmentId}/pools` : '/pools';
    return this.request(endpoint);
  }

  async getInstancePool(poolId: string): Promise<ApiResponse> {
    return this.request(`/pools/${poolId}`);
  }

  async createInstancePool(data: any): Promise<ApiResponse> {
    return this.request('/pools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInstancePool(poolId: string, data: any): Promise<ApiResponse> {
    return this.request(`/pools/${poolId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteInstancePool(poolId: string): Promise<ApiResponse> {
    return this.request(`/pools/${poolId}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices(environmentId?: string): Promise<ApiResponse> {
    const endpoint = environmentId ? `/environments/${environmentId}/services` : '/services';
    return this.request(endpoint);
  }

  async getService(serviceId: string): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`);
  }

  async createService(data: any): Promise<ApiResponse> {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(serviceId: string, data: any): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteService(serviceId: string): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  async scaleService(serviceId: string, replicas: number): Promise<ApiResponse> {
    return this.request(`/services/${serviceId}/scale`, {
      method: 'POST',
      body: JSON.stringify({ replicas }),
    });
  }

  // Events
  async getEvents(resourceType?: string, resourceId?: string): Promise<ApiResponse> {
    let endpoint = '/events';
    const params = new URLSearchParams();
    if (resourceType) params.append('resourceType', resourceType);
    if (resourceId) params.append('resourceId', resourceId);
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  }

  async getEvent(eventId: string): Promise<ApiResponse> {
    return this.request(`/events/${eventId}`);
  }

  // Monitoring
  async getMonitoringData(instanceId: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    let endpoint = `/monitoring/instances/${instanceId}`;
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  }

  async getServiceMonitoring(serviceId: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    let endpoint = `/monitoring/services/${serviceId}`;
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  }

  // Analytics
  async getAnalytics(environmentId?: string, startTime?: string, endTime?: string): Promise<ApiResponse> {
    let endpoint = '/analytics';
    const params = new URLSearchParams();
    if (environmentId) params.append('environmentId', environmentId);
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.request(endpoint);
  }

  // RBAC
  async getRoles(): Promise<ApiResponse> {
    return this.request('/rbac/roles');
  }

  async getRole(roleId: string): Promise<ApiResponse> {
    return this.request(`/rbac/roles/${roleId}`);
  }

  async assignRole(userId: string, roleId: string, resourceType: string, resourceId: string): Promise<ApiResponse> {
    return this.request('/rbac/assignments', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId, resourceType, resourceId }),
    });
  }
}

