/**
 * Types pour l'API LayerOps
 */

export interface LayerOpsConfig {
  apiKeyId: string;
  apiKeySecret: string;
  baseUrl?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface Instance {
  id: string;
  name: string;
  status: string;
  type: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  image: string;
  status: string;
  environmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Environment {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstancePool {
  id: string;
  name: string;
  instanceType: string;
  minInstances: number;
  maxInstances: number;
  currentInstances: number;
  environmentId: string;
}

export interface Event {
  id: string;
  type: string;
  resourceType: string;
  resourceId: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

export interface MonitoringData {
  instanceId: string;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  timestamp: string;
}

export interface CreateInstanceRequest {
  name: string;
  instanceType: string;
  region: string;
  image?: string;
  environmentId: string;
  poolId?: string;
}

export interface CreateServiceRequest {
  name: string;
  image: string;
  environmentId: string;
  ports?: Array<{ containerPort: number; hostPort?: number }>;
  env?: Record<string, string>;
  replicas?: number;
}

export interface CreateEnvironmentRequest {
  name: string;
  projectId: string;
}

export interface CreateProjectRequest {
  name: string;
}

export interface CreateInstancePoolRequest {
  name: string;
  instanceType: string;
  minInstances: number;
  maxInstances: number;
  environmentId: string;
  autoScaling?: boolean;
}

